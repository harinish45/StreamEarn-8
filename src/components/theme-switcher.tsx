'use client';

import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return <DropdownMenuSub>
    <DropdownMenuSubTrigger className="rounded-xl">Theme</DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent sideOffset={8} className="w-[250px] rounded-xl border bg-popover/95 p-1 backdrop-blur-xl">
        {themes.map((t) => <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)} className="rounded-lg py-2.5">
          <span className="mr-2 h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/10" style={{ background: t.accent }} />
          <span className="min-w-0 flex-1"><span className="block text-xs font-medium">{t.name}</span><span className="block truncate text-[10px] text-muted-foreground">{t.description}</span></span>
          {theme === t.name && <Check className="ml-2 h-4 w-4 shrink-0" />}
        </DropdownMenuItem>)}
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>;
}
