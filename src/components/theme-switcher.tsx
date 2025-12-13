'use client';

import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Check } from 'lucide-react';

function getThemeClass(themeName: string) {
  if (themeName === 'Light' || themeName === 'Dark') {
    return themeName.toLowerCase();
  }
  return themeName.toLowerCase().replace(/\s/g, "-");
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>Themes</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {themes.map((t) => (
            <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)}>
              <span className="flex items-center justify-between w-full">
                {t.name}
                {theme === t.name && <Check className="h-4 w-4" />}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}