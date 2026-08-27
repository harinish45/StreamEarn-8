export const SCHEDULER_CATEGORIES = ['ai_news', 'internships', 'scholarships', 'earnings'] as const;
export type SchedulerCategory = typeof SCHEDULER_CATEGORIES[number];
export const SCHEDULER_LABELS: Record<SchedulerCategory,string> = {
  ai_news: 'AI News',
  internships: 'Internships',
  scholarships: 'Scholarships',
  earnings: 'Earning Opportunities',
};
export function isSchedulerCategory(value: unknown): value is SchedulerCategory {
  return typeof value === 'string' && (SCHEDULER_CATEGORIES as readonly string[]).includes(value);
}
