import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const files = {
  news: new URL('src/data/scheduled/ai-news.json', root),
  internships: new URL('src/data/scheduled/internships.json', root),
  scholarships: new URL('src/data/scheduled/scholarships.json', root),
  earnings: new URL('src/data/scheduled/earnings.json', root),
};
const categories = Object.keys(files);

function clean(value, max) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function hash(category, item) { return crypto.createHash('sha256').update(JSON.stringify({ category, title: item.title || '', url: item.url || '', published: item.published || '' })).digest('hex'); }
async function read(url) { try { const value = JSON.parse(await fs.readFile(url, 'utf8')); if (!Array.isArray(value)) throw new Error('not an array'); return value; } catch (e) { if (e?.code === 'ENOENT') return []; throw new Error(`Refusing migration: invalid ${url.pathname}`); } }

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  const { createClient } = await import('@supabase/supabase-js');
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  let total = 0;
  for (const category of categories) {
    const records = await read(files[category]);
    let inserted = 0;
    for (const item of records) {
      const title = clean(item.title, 500);
      const url = clean(item.url, 2000);
      if (!title || !/^https:\/\//i.test(url)) continue;
      const { error } = await db.from('scheduler_items').upsert({ category, title, description: clean(item.description || item.summary, 10000), source: clean(item.source || item.organization, 300), url, published_at: item.published ? new Date(item.published).toISOString() : null, content_hash: hash(category, item) }, { onConflict: 'content_hash', ignoreDuplicates: true });
      if (error) throw error;
      inserted++;
    }
    console.log(`${category}: validated ${records.length}, imported ${inserted}`);
    total += inserted;
  }
  console.log(`Migration validation/import complete. Existing JSON files were not modified. Processed ${total} records.`);
}
await main();
