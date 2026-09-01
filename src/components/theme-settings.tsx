'use client';

import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  return <div className="grid gap-2 sm:grid-cols-2">
    {themes.map((t) => <button key={t.name} type="button" onClick={() => setTheme(t.name)} className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${theme === t.name ? 'border-primary/60 bg-primary/10' : 'border-border bg-background/40 hover:border-primary/30'}`}>
      <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-white/10" style={{ background: t.accent }} />
      <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{t.name}</span><span className="block truncate text-[11px] text-muted-foreground">{t.description}</span></span>
      {theme === t.name && <span className="text-[10px] font-semibold text-primary">Active</span>}
    </button>)}
  </div>;
}
