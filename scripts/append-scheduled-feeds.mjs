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
  news: [
    'artificial intelligence AI agents LLM developer tools',
    'OpenAI Anthropic Google AI Microsoft AI',
    'AI cybersecurity security research',
    'AI infrastructure chips models startups',
  ],
  internships: [
    'cybersecurity internship 2026 India',
    'software engineering internship 2026 India',
    'AI machine learning internship 2026 India',
    'student internship 2026 remote technology',
  ],
  scholarships: [
    'scholarship 2026 India undergraduate',
    'engineering scholarship 2026 India students',
    'computer science scholarship 2026 India',
    'government scholarship 2026 India college',
  ],
  earnings: [
    'remote freelance paid opportunities India 2026',
    'online earning jobs students India 2026',
    'remote work freelance gigs technology 2026',
    'AI freelance jobs paid opportunities 2026',
  ],
};

const limitPerFeed = 12;

function decode(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1].trim()) : '';
}

function itemsFromRss(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => {
    const item = m[1];
    return {
      title: tag(item, 'title'),
      link: tag(item, 'link'),
      published: tag(item, 'pubDate') || new Date().toISOString(),
      source: tag(item, 'source') || 'Google News',
    };
  }).filter((x) => x.title && x.link);
}

async function fetchSearch(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const response = await fetch(url, { headers: { 'user-agent': 'StreamEarn-Scheduler/1.0' } });
  if (!response.ok) throw new Error(`RSS ${response.status} for ${query}`);
  return itemsFromRss(await response.text());
}

function idFor(kind, item) {
  return crypto.createHash('sha256').update(`${kind}|${item.link}|${item.title}`.toLowerCase()).digest('hex').slice(0, 20);
}

function normalize(kind, item) {
  const id = idFor(kind, item);
  const common = { id, title: item.title, url: item.link, source: item.source, published: item.published, collectedAt: new Date().toISOString() };
  if (kind === 'news') return { ...common, category: 'AI Update', summary: item.title };
  if (kind === 'internships') return { ...common, organization: item.source, focus: 'Technology / Student Opportunity', location: 'India / Remote varies', summary: item.title, eligibility: 'Verify eligibility, deadline and application details on the linked source.' };
  if (kind === 'scholarships') return { ...common, organization: item.source, focus: 'Education / Student Support', location: 'India', summary: item.title, eligibility: 'Verify eligibility, award amount and deadline on the linked source.' };
  return { ...common, category: 'Daily Earning Opportunity', description: item.title, tags: ['Remote', 'Earning', 'Opportunity'] };
}

async function readStore(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return []; }
}

async function writeStore(file, records) {
  await fs.mkdir(new URL('.', file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

async function collect(kind) {
  const existing = await readStore(stores[kind]);
  const seen = new Set(existing.map((x) => x.id));
  const urls = new Set(existing.map((x) => x.url));
  const added = [];
  for (const query of searches[kind]) {
    try {
      const results = await fetchSearch(query);
      for (const raw of results) {
        const record = normalize(kind, raw);
        if (seen.has(record.id) || urls.has(record.url)) continue;
        seen.add(record.id); urls.add(record.url); added.push(record);
        if (added.length >= limitPerFeed) break;
      }
    } catch (error) {
      console.warn(`[${kind}] ${error.message}`);
    }
    if (added.length >= limitPerFeed) break;
  }
  const merged = [...existing, ...added];
  await writeStore(stores[kind], merged);
  console.log(`${kind}: kept ${existing.length}, appended ${added.length}, total ${merged.length}`);
  return added.length;
}

let total = 0;
for (const kind of Object.keys(stores)) total += await collect(kind);
console.log(`StreamEarn append-only scheduler complete. Added ${total} new records.`);
