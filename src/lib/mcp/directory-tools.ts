import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { currentAIDirectory } from '@/lib/current-ai-directory';
import { currentAIAdditions } from '@/lib/current-ai-additions';
import { initialLinks } from '@/lib/resource-data';
import { earningOpportunities } from '@/lib/data';
import { isSchedulerCategory, type SchedulerCategory } from '@/lib/scheduler-categories';

const matches = (haystack: string, query: string) => haystack.toLowerCase().includes(query.toLowerCase());

export function listAiTools(query?: string, limit = 50) {
  const categories = [...currentAIDirectory, ...currentAIAdditions];
  const rows = categories.flatMap((category) =>
    category.tools.map((tool) => ({ category: category.name, name: tool.name, url: tool.url, summary: tool.summary, tags: tool.tags, featured: Boolean(tool.featured) })),
  );
  const filtered = query ? rows.filter((r) => matches(`${r.name} ${r.summary} ${r.tags.join(' ')} ${r.category}`, query)) : rows;
  return filtered.slice(0, Math.max(1, Math.min(limit, 200)));
}

export function listResources(query?: string, limit = 50) {
  const filtered = query ? initialLinks.filter((r) => matches(`${r.title} ${r.description || ''} ${r.tags.join(' ')}`, query)) : initialLinks;
  return filtered.slice(0, Math.max(1, Math.min(limit, 200))).map((r) => ({ id: r.id, title: r.title, url: r.url, description: r.description, tags: r.tags }));
}

export function listEarningPlatforms(query?: string, limit = 50) {
  const rows = earningOpportunities.flatMap((category) =>
    category.opportunities?.map((o: any) => ({ category: category.name, title: o.title, description: o.description, link: o.link, tags: o.tags || [] })) || [],
  );
  const filtered = query ? rows.filter((r) => matches(`${r.title} ${r.description || ''} ${(r.tags || []).join(' ')} ${r.category}`, query)) : rows;
  return filtered.slice(0, Math.max(1, Math.min(limit, 200)));
}

export async function listSchedulerFeed(category: string, limit = 50) {
  if (!isSchedulerCategory(category)) throw new Error(`Invalid category. Expected one of: ai_news, internships, scholarships, earnings.`);
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from('scheduler_items')
    .select('id,category,title,description,source,url,published_at,created_at')
    .eq('category', category satisfies SchedulerCategory)
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(Math.max(1, Math.min(limit, 100)));
  if (error) throw error;
  return data || [];
}
