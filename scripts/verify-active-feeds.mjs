import crypto from 'node:crypto';

const searchConfig = {
  ai_news: {
    queries: [
      'artificial intelligence AI agents LLM developer tools',
      'OpenAI Anthropic Google AI Microsoft AI',
      'AI cybersecurity security research',
      'AI infrastructure chips models startups'
    ],
    window: '7d',
    maxAgeDays: 7
  },
  internships: {
    queries: [
      'cybersecurity internship 2026 India',
      'software engineering internship 2026 India',
      'AI machine learning internship 2026 India',
      'student internship 2026 remote technology'
    ],
    window: '30d',
    maxAgeDays: 30
  },
  scholarships: {
    queries: [
      'scholarship 2026 India undergraduate',
      'engineering scholarship 2026 India students',
      'computer science scholarship 2026 India',
      'government scholarship 2026 India college'
    ],
    window: '30d',
    maxAgeDays: 30
  }
};

// Daily automation is append-only. It never archives, deletes, truncates, or replaces records.
// Historical earnings records are left untouched and can be managed manually.
const limit = 12;
const maxBytes = 2 * 1024 * 1024;
const RETRIES = 4;
const FUTURE_DATE_TOLERANCE_MS = 6 * 60 * 60 * 1000;

const clean = (v, max) => typeof v === 'string'
  ? v.replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
  : '';

const tag = (xml, name) => {
  const m = xml.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i'));
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
      console.warn('[retry] ' + label + ' failed (attempt ' + attempt + '/' + attempts + '); retrying in ' + delay + 'ms: ' + (error?.message || 'unknown error'));
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

async function fetchFeed(query, timeWindow) {
  const params = new URLSearchParams({
    q: query + ' when:' + timeWindow,
    hl: 'en-IN',
    gl: 'IN',
    ceid: 'IN:en'
  });
  const url = 'https://news.google.com/rss/search?' + params.toString();

  const xml = await retry('RSS ' + query, async () => {
    const response = await fetch(url, {
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'StreamEarn-ActiveData/2.2' }
    });
    if (!response.ok) throw new Error('RSS ' + response.status);
    const body = await response.text();
    if (Buffer.byteLength(body) > maxBytes) throw new Error('RSS too large');
    return body;
  });

  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const item = match[1];
    return {
      title: clean(tag(item, 'title'), 500),
      url: tag(item, 'link').trim(),
      source: clean(tag(item, 'source'), 300) || 'Google News',
      published: tag(item, 'pubDate')
    };
  }).filter((item) => item.title && item.published && isPublicHttps(item.url));
}

function hash(category, item) {
  return crypto.createHash('sha256').update(JSON.stringify({
    category,
    title: item.title,
    description: item.title,
    source: item.source,
    url: item.url,
    publishedAt: item.publishedAt
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

  console.log('--- APPEND-ONLY, FRESH-FIRST DISCOVERY ---');
  let totalDiscovered = 0;

  for (const [category, config] of Object.entries(searchConfig)) {
    let added = 0;

    try {
      const { data: existing, error: existingError } = await retry('load existing ' + category + ' rows', () =>
        db.from('scheduler_items').select('url, content_hash').eq('category', category)
      );
      if (existingError) throw existingError;

      const seen = new Set();
      for (const row of existing || []) {
        if (row.url) seen.add(row.url);
        if (row.content_hash) seen.add(row.content_hash);
      }

      const now = Date.now();
      const cutoff = now - config.maxAgeDays * 24 * 60 * 60 * 1000;
      const candidatesByUrl = new Map();

      for (const query of config.queries) {
        try {
          const feed = await fetchFeed(query, config.window);
          for (const item of feed) {
            if (seen.has(item.url)) continue;

            const publishedTime = new Date(item.published).getTime();
            if (!Number.isFinite(publishedTime)) continue;
            if (publishedTime < cutoff || publishedTime > now + FUTURE_DATE_TOLERANCE_MS) continue;

            const candidate = { ...item, publishedAt: new Date(publishedTime).toISOString() };
            const previous = candidatesByUrl.get(candidate.url);
            if (!previous || publishedTime > Date.parse(previous.publishedAt)) {
              candidatesByUrl.set(candidate.url, candidate);
            }
          }
        } catch (error) {
          // A single bad feed must never stop the remaining queries/categories.
          console.warn('[' + category + '] query skipped after retries: ' + (error?.message || 'unknown error'));
        }
      }

      // Gather from every query before choosing records so the newest items win,
      // rather than whichever query happens to be processed first.
      const candidates = [...candidatesByUrl.values()]
        .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

      for (const item of candidates) {
        if (added >= limit) break;

        const contentHash = hash(category, item);
        if (seen.has(contentHash)) continue;
        seen.add(item.url);
        seen.add(contentHash);

        await retry('append ' + category + ' item', async () => {
          const { error } = await db.rpc('append_scheduler_item', {
            p_category: category,
            p_title: item.title,
            p_description: clean(item.title, 10_000),
            p_source: item.source,
            p_url: item.url,
            p_published_at: item.publishedAt,
            p_content_hash: contentHash
          });
          if (error) throw error;
        });
        added++;
      }

      console.log(category + ': ' + added + ' new active records, sorted newest-first; freshness window ' + config.window + '.');
      totalDiscovered += added;
    } catch (error) {
      // Keep the daily run resilient to a single category's transient provider/DB issue.
      console.warn('[' + category + '] category skipped after retries: ' + (error?.message || 'unknown error'));
    }
  }

  console.log('Active-data verification complete. Discovered ' + totalDiscovered + ' fresh records; existing records were left untouched.');
}

await main();
