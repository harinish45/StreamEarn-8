import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ROOT = new URL('../', import.meta.url);
const stores = {
  news: new URL('src/data/scheduled/ai-news.json', ROOT),
  internships: new URL('src/data/scheduled/internships.json', ROOT),
  scholarships: new URL('src/data/scheduled/scholarships.json', ROOT),
  earnings: new URL('src/data/scheduled/earnings.json', ROOT),
};

const searches = {
  news: ['artificial intelligence AI agents LLM developer tools', 'OpenAI Anthropic Google AI Microsoft AI', 'AI cybersecurity security research', 'AI infrastructure chips models startups'],
  internships: ['cybersecurity internship 2026 India', 'software engineering internship 2026 India', 'AI machine learning internship 2026 India', 'student internship 2026 remote technology'],
  scholarships: ['scholarship 2026 India undergraduate', 'engineering scholarship 2026 India students', 'computer science scholarship 2026 India', 'government scholarship 2026 India college'],
  earnings: ['remote freelance paid opportunities India 2026', 'online earning jobs students India 2026', 'remote work freelance gigs technology 2026', 'AI freelance jobs paid opportunities 2026'],
};

const limitPerFeed = 12;
const MAX_TITLE = 300;
const MAX_SOURCE = 160;
const MAX_URL = 2048;
const MAX_RSS_BYTES = 2 * 1024 * 1024;
const ALLOWED_HOSTS = new Set(['news.google.com']);

function decode(value = '') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

function stripMarkup(value = '') { return value.replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim(); }
function cleanText(value = '', max = MAX_TITLE) { return stripMarkup(decode(value)).slice(0, max); }

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1].trim()) : '';
}

function itemsFromRss(xml) {
  if (xml.length > MAX_RSS_BYTES) return [];
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => {
    const item = m[1];
    return { title: cleanText(tag(item, 'title')), link: tag(item, 'link').trim(), published: tag(item, 'pubDate') || new Date().toISOString(), source: cleanText(tag(item, 'source'), MAX_SOURCE) || 'Google News' };
  }).filter((x) => x.title && x.link);
}

function isSafeUrl(value) {
  if (!value || value.length > MAX_URL) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname && !['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(url.hostname);
  } catch { return false; }
}

async function fetchSearch(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) throw new Error('Blocked feed host');
  const response = await fetch(url, { headers: { 'user-agent': 'StreamEarn-Scheduler/1.0' }, redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`RSS request failed (${response.status})`);
  const text = await response.text();
  if (Buffer.byteLength(text, 'utf8') > MAX_RSS_BYTES) throw new Error('RSS response too large');
  return itemsFromRss(text);
}

function idFor(kind, item) { return crypto.createHash('sha256').update(`${kind}|${item.link}|${item.title}`.toLowerCase()).digest('hex').slice(0, 20); }

function normalize(kind, item) {
  if (!isSafeUrl(item.link)) return null;
  const id = idFor(kind, item);
  const common = { id, title: cleanText(item.title), url: item.link.slice(0, MAX_URL), source: cleanText(item.source, MAX_SOURCE), published: cleanText(item.published, 100), collectedAt: new Date().toISOString() };
  if (!common.title) return null;
  if (kind === 'news') return { ...common, category: 'AI Update', summary: common.title };
  if (kind === 'internships') return { ...common, organization: common.source, focus: 'Technology / Student Opportunity', location: 'India / Remote varies', summary: common.title, eligibility: 'Verify eligibility, deadline and application details on the linked source.' };
  if (kind === 'scholarships') return { ...common, organization: common.source, focus: 'Education / Student Support', location: 'India', summary: common.title, eligibility: 'Verify eligibility, award amount and deadline on the linked source.' };
  return { ...common, category: 'Daily Earning Opportunity', description: common.title, tags: ['Remote', 'Earning', 'Opportunity'] };
}

async function readStore(file) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Store is not an array');
    return parsed;
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw new Error(`Refusing to modify corrupted store: ${file.pathname}`);
  }
}

async function writeStore(file, records) {
  const temp = new URL(`${file.pathname}.tmp-${process.pid}-${Date.now()}`);
  await fs.writeFile(temp, `${JSON.stringify(records, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  await fs.rename(temp, file);
}

async function collect(kind) {
  const existing = await readStore(stores[kind]);
  const seen = new Set(existing.map((x) => x.id).filter(Boolean));
  const urls = new Set(existing.map((x) => x.url).filter(Boolean));
  const added = [];
  for (const query of searches[kind]) {
    try {
      const results = await fetchSearch(query);
      for (const raw of results) {
        const record = normalize(kind, raw);
        if (!record || seen.has(record.id) || urls.has(record.url)) continue;
        seen.add(record.id); urls.add(record.url); added.push(record);
        if (added.length >= limitPerFeed) break;
      }
    } catch (error) { console.warn(`[${kind}] feed skipped: ${error instanceof Error ? error.message : 'unknown error'}`); }
    if (added.length >= limitPerFeed) break;
  }
  if (added.length > 0) await writeStore(stores[kind], [...existing, ...added]);
  console.log(`${kind}: kept ${existing.length}, appended ${added.length}, total ${existing.length + added.length}`);
  return added.length;
}

let total = 0;
for (const kind of Object.keys(stores)) total += await collect(kind);
console.log(`StreamEarn append-only scheduler complete. Added ${total} new records.`);
