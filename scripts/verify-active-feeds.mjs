import crypto from 'node:crypto';

const searches = {
  ai_news: ['artificial intelligence AI agents LLM developer tools', 'OpenAI Anthropic Google AI Microsoft AI', 'AI cybersecurity security research', 'AI infrastructure chips models startups'],
  internships: ['cybersecurity internship 2026 India', 'software engineering internship 2026 India', 'AI machine learning internship 2026 India', 'student internship 2026 remote technology'],
  scholarships: ['scholarship 2026 India undergraduate', 'engineering scholarship 2026 India students', 'computer science scholarship 2026 India', 'government scholarship 2026 India college'],
  earnings: ['remote freelance paid opportunities India 2026', 'online earning jobs students India 2026', 'remote work freelance gigs technology 2026', 'AI freelance jobs paid opportunities 2026']
};

const EXPIRY_DAYS = { ai_news: 7, earnings: 30, internships: 60, scholarships: 90 };
const limit = 12;
const maxBytes = 2 * 1024 * 1024;

const clean = (v, max) => typeof v === 'string'
  ? v.replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
  : '';
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '') : '';
};

function isPublicHttps(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    return !['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(host)
      && !host.endsWith('.local')
      && !host.endsWith('.internal');
  } catch { return false; }
}

async function fetchFeed(q) {
  const u = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const r = await fetch(u, { redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'StreamEarn-ActiveData/2.0' } });
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
  }).filter(x => x.title && isPublicHttps(x.url));
}

function hash(c, x) {
  return crypto.createHash('sha256').update(JSON.stringify({
    category: c,
    title: x.title,
    description: x.title,
    source: x.source,
    url: x.url,
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

  console.log('--- PHASE 1: ARCHIVE STALE DATA ---');
  const now = new Date();
  let archived = 0;

  const { data: activeItems, error: activeError } = await db
    .from('scheduler_items')
    .select('id, category, published_at, url, archived_at')
    .is('archived_at', null);

  if (activeError) throw activeError;

  for (const item of activeItems || []) {
    const expiryDays = EXPIRY_DAYS[item.category] || 45;
    const publishedDate = item.published_at ? new Date(item.published_at) : now;
    const ageDays = (now.getTime() - publishedDate.getTime()) / 86400000;
    if (ageDays > expiryDays) {
      const { error } = await db
        .from('scheduler_items')
        .update({ archived_at: now.toISOString() })
        .eq('id', item.id)
        .is('archived_at', null);
      if (error) throw error;
      archived++;
    }
  }
  console.log(`Archived ${archived} stale records.`);

  console.log('--- PHASE 2: DISCOVER, NORMALIZE & DEDUPLICATE ---');
  let totalDiscovered = 0;

  for (const [category, qs] of Object.entries(searches)) {
    const seen = new Set();
    let added = 0;

    const { data: existing, error: existingError } = await db
      .from('scheduler_items')
      .select('url, content_hash')
      .in('category', [category]);
    if (existingError) throw existingError;

    for (const row of existing || []) {
      if (row.url) seen.add(row.url);
      if (row.content_hash) seen.add(row.content_hash);
    }

    for (const q of qs) {
      if (added >= limit) break;
      try {
        for (const x of await fetchFeed(q)) {
          if (added >= limit || seen.has(x.url)) continue;

          let publishedAt = null;
          if (x.published) {
            const d = new Date(x.published);
            if (Number.isNaN(d.getTime())) continue;
            publishedAt = d.toISOString();
          }

          const content_hash = hash(category, { ...x, publishedAt });
          if (seen.has(content_hash)) continue;
          seen.add(x.url);
          seen.add(content_hash);

          const { error } = await db.rpc('append_scheduler_item', {
            p_category: category,
            p_title: x.title,
            p_description: clean(x.title, 10000),
            p_source: x.source,
            p_url: x.url,
            p_published_at: publishedAt,
            p_content_hash: content_hash
          });
          if (error) throw error;
          added++;
        }
      } catch (error) {
        console.warn(`[${category}] query skipped: ${error?.message || 'unknown error'}`);
      }
    }

    console.log(`${category}: ${added} new active records.`);
    totalDiscovered += added;
  }

  console.log(`Active-data verification complete. Archived ${archived}; discovered ${totalDiscovered} new records.`);
}

await main();
