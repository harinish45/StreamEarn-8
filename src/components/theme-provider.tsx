'use client';

import * as React from 'react';
import { themes } from '@/lib/themes';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: string;
  setTheme: (theme: string) => void;
};

const initialState: ThemeProviderState = { theme: 'system', setTheme: () => null };

const legacyThemeMap: Record<string, string> = {
  Matrix: 'Harry Potter',
  'Iron Man': 'Pirates of the Caribbean',
  Hulk: 'Stranger Things',
};

function getThemeClass(themeName: string | undefined) {
  const canonical = legacyThemeMap[themeName ?? ''] ?? themeName ?? 'Light';
  return canonical.toLowerCase().replace(/\s+/g, '-');
}

function canonicalThemeName(themeName: string, defaultTheme: string) {
  if (themeName === 'system') return defaultTheme;
  return legacyThemeMap[themeName] ?? themeName;
}

export function ThemeProvider({ children, defaultTheme = 'Light', storageKey = 'theme', ...props }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(defaultTheme);

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const normalized = stored ? canonicalThemeName(stored, defaultTheme) : defaultTheme;
    setTheme(normalized);
  }, [storageKey, defaultTheme]);

  React.useEffect(() => {
    const body = document.body;
    const allThemeClasses = new Set(['light', 'dark', ...themes.map(t => getThemeClass(t.name))]);
    allThemeClasses.forEach(cls => body.classList.remove(cls));

    const effective = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light')
      : canonicalThemeName(theme, defaultTheme);
    const nextClass = getThemeClass(effective);
    body.classList.add(nextClass);

    const doc = document.documentElement;
    doc.classList.remove('light', 'dark');
    const darkThemes = new Set([
      'dark', 'dark-web-series', 'harry-potter', 'spider-man', 'batman',
      'pirates-of-the-caribbean', 'stranger-things'
    ]);
    doc.classList.add(darkThemes.has(nextClass) ? 'dark' : 'light');
  }, [theme, defaultTheme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: string) => {
      const normalized = canonicalThemeName(newTheme, defaultTheme);
      localStorage.setItem(storageKey, normalized);
      setTheme(normalized);
    },
  }), [theme, storageKey, defaultTheme]);

  return <ThemeProviderContext.Provider {...props} value={value}>{children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
