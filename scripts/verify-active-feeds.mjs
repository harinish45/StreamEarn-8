import crypto from 'node:crypto';

const searches = {
  ai_news: ['artificial intelligence AI agents LLM developer tools', 'OpenAI Anthropic Google AI Microsoft AI', 'AI cybersecurity security research', 'AI infrastructure chips models startups'],
  internships: ['cybersecurity internship 2026 India', 'software engineering internship 2026 India', 'AI machine learning internship 2026 India', 'student internship 2026 remote technology'],
  scholarships: ['scholarship 2026 India undergraduate', 'engineering scholarship 2026 India students', 'computer science scholarship 2026 India', 'government scholarship 2026 India college']
};

// Daily automation is append-only. It never archives, deletes, truncates, or replaces records.

// Only these three categories are maintained by the daily automation.
// Historical earnings records are left untouched and can be managed manually.
const limit = 12;
const maxBytes = 2 * 1024 * 1024;
const RETRIES = 4;

const clean = (v, max) => typeof v === 'string'
  ? v.replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
  : '';
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '') : '';
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(label, fn, attempts = RETRIES) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      const delay = Math.min(15_000, 750 * 2 ** (attempt - 1));
      console.warn(`[retry] ${label} failed (attempt ${attempt}/${attempts}); retrying in ${delay}ms: ${error?.message || 'unknown error'}`);
      await sleep(delay);
    }
  }
  throw lastError;
}

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
  const r = await retry(`RSS ${q}`, async () => {
    const response = await fetch(u, {
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'StreamEarn-ActiveData/2.1' }
    });
    if (!response.ok) throw new Error(`RSS ${response.status}`);
    const text = await response.text();
    if (Buffer.byteLength(text) > maxBytes) throw new Error('RSS too large');
    return text;
  });

  return [...r.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => {
    const x = m[1];
    return {
      title: clean(tag(x, 'title'), 500),
      url: tag(x, 'link').trim(),
      source: clean(tag(x, 'source'), 300) || 'Google News',
      published: tag(x, 'pubDate')
    };
  }).filter((x) => x.title && isPublicHttps(x.url));
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

  console.log('--- PHASE 0: DATABASE PREFLIGHT ---');
  await retry('Supabase scheduler preflight', async () => {
    const { error } = await db.from('scheduler_items').select('id').limit(1);
    if (error) throw error;
  });

  console.log('--- APPEND-ONLY DISCOVERY ---');
  let totalDiscovered = 0;

  for (const [category, qs] of Object.entries(searches)) {
    const seen = new Set();
    let added = 0;

    try {
      const { data: existing, error: existingError } = await retry(`load existing ${category} rows`, () =>
        db.from('scheduler_items').select('url, content_hash').eq('category', category)
      );
      if (existingError) throw existingError;

      for (const row of existing || []) {
        if (row.url) seen.add(row.url);
        if (row.content_hash) seen.add(row.content_hash);
      }

      for (const q of qs) {
        if (added >= limit) break;
        try {
          const feed = await fetchFeed(q);
          for (const x of feed) {
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

            await retry(`append ${category} item`, async () => {
              const { error } = await db.rpc('append_scheduler_item', {
                p_category: category,
                p_title: x.title,
                p_description: clean(x.title, 10_000),
                p_source: x.source,
                p_url: x.url,
                p_published_at: publishedAt,
                p_content_hash: content_hash
              });
              if (error) throw error;
            });
            added++;
          }
        } catch (error) {
          // One bad feed must never stop the remaining queries/categories.
          console.warn(`[${category}] query skipped after retries: ${error?.message || 'unknown error'}`);
        }
      }

      console.log(`${category}: ${added} new active records.`);
      totalDiscovered += added;
    } catch (error) {
      // Keep the daily run resilient to a single category's transient provider/DB issue.
      console.warn(`[${category}] category skipped after retries: ${error?.message || 'unknown error'}`);
    }
  }

  console.log(`Active-data verification complete. Discovered ${totalDiscovered} new records; existing records were left untouched.`);
}

await main();
