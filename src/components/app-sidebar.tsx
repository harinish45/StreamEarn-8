'use client';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import type { EarningCategory } from '@/lib/data';

export function AppSidebar({ categories: _categories }: { categories: EarningCategory[] }) {
  return <UnifiedSidebar />;
}
