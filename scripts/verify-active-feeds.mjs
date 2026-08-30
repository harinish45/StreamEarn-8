import crypto from 'node:crypto';

const searches = {
  ai_news: ['artificial intelligence AI agents LLM developer tools', 'OpenAI Anthropic Google AI Microsoft AI', 'AI cybersecurity security research', 'AI infrastructure chips models startups'],
  internships: ['cybersecurity internship 2026 India', 'software engineering internship 2026 India', 'AI machine learning internship 2026 India', 'student internship 2026 remote technology'],
  scholarships: ['scholarship 2026 India undergraduate', 'engineering scholarship 2026 India students', 'computer science scholarship 2026 India', 'government scholarship 2026 India college'],
  earnings: ['remote freelance paid opportunities India 2026', 'online earning jobs students India 2026', 'remote work freelance gigs technology 2026', 'AI freelance jobs paid opportunities 2026']
};

const EXPIRY_DAYS = {
  ai_news: 7,
  earnings: 30,
  internships: 60,
  scholarships: 90
};

const limit = 12, maxBytes = 2 * 1024 * 1024;

const clean = (v, max) => typeof v === 'string' ? v.replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '';
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')); return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '') : '' };

async function fetchFeed(q) {
  const u = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const r = await fetch(u, { redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'StreamEarn-Scheduler/1.0' } });
  if (!r.ok) throw new Error(`RSS ${r.status}`);
  const t = await r.text();
  if (Buffer.byteLength(t) > maxBytes) throw new Error('RSS too large');
  
  return [...t.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m => {
    const x = m[1];
    return {
      title: clean(tag(x, 'title'), 500),
      url: tag(x, 'link').trim(),
      source: clean(tag(x, 'source'), 300) || 'Google News',
      published: tag(x, 'pubDate')
    };
  }).filter(x => x.title && /^https:\/\//i.test(x.url));
}

function hash(c, x) {
  return crypto.createHash('sha256').update(JSON.stringify({
    category: c, title: x.title, description: x.title, source: x.source, url: x.url,
    publishedAt: x.published ? new Date(x.published).toISOString() : null
  })).digest('hex');
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase scheduler credentials');
  }
  
  const { createClient } = await import('@supabase/supabase-js');
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  console.log('--- PHASE 1: ARCHIVE EXPIRED DATA ---');
  const now = new Date();
  
  // Assuming Supabase table has 'status' and 'published_at' columns.
  // If not, this step will log a warning but proceed to discover.
  try {
    const { data: activeItems, error: fetchError } = await db
      .from('scheduler_items')
      .select('id, category, published_at')
      .eq('status', 'active');

    if (fetchError) throw fetchError;

    let expiredCount = 0;
    for (const item of (activeItems || [])) {
      const expiryDays = EXPIRY_DAYS[item.category] || 45;
      const publishedDate = item.published_at ? new Date(item.published_at) : now;
      const diffDays = (now - publishedDate) / (1000 * 60 * 60 * 24);
      
      if (diffDays > expiryDays) {
        await db.from('scheduler_items').update({ status: 'expired' }).eq('id', item.id);
        expiredCount++;
      }
    }
    console.log(`Archived ${expiredCount} expired records.`);
  } catch (err) {
    console.warn(`[Archive Phase] Skipped or failed (ensure 'status' and 'published_at' columns exist): ${err.message}`);
  }

  console.log('\n--- PHASE 2: DISCOVER & NORMALIZE ---');
  let totalDiscovered = 0;

  for (const [category, qs] of Object.entries(searches)) {
    const seen = new Set();
    let added = 0;

    // Fetch existing active URLs to deduplicate
    try {
      const { data: existing } = await db
        .from('scheduler_items')
        .select('url, content_hash')
        .in('status', ['active', 'expired']);
        
      if (existing) {
        existing.forEach(e => {
          seen.add(e.url);
          if (e.content_hash) seen.add(e.content_hash);
        });
      }
    } catch (err) {
      console.warn(`Could not fetch existing URLs for deduplication: ${err.message}`);
    }

    for (const q of qs) {
      try {
        for (const x of await fetchFeed(q)) {
          if (seen.has(x.url) || added >= limit) continue;
          seen.add(x.url);

          let publishedAt = null;
          if (x.published) {
            const d = new Date(x.published);
            if (Number.isNaN(d.getTime())) continue;
            publishedAt = d.toISOString();
          }

          const description = clean(x.title, 10000);
          const content_hash = hash(category, { ...x, publishedAt });
          
          if (seen.has(content_hash)) continue;
          seen.add(content_hash);

          // QUALITY SCORE / ACTIVE DATASET
          const { error } = await db.rpc('append_scheduler_item', {
            p_category: category,
            p_title: x.title,
            p_description: description,
            p_source: x.source,
            p_url: x.url,
            p_published_at: publishedAt,
            p_content_hash: content_hash
          });

          if (error) throw error;
          added++;
        }
      } catch (e) {
        console.warn(`[${category}] query skipped: ${e?.message || 'unknown error'}`);
      }
    }
    console.log(`${category}: discovered and added ${added} new active records.`);
    totalDiscovered += added;
  }

  console.log(`\nVerification pipeline complete. ${totalDiscovered} new active records added.`);
}

await main();