'use client';

import * as React from 'react';
import { themes } from '@/lib/themes';

type ThemeProviderProps = { children: React.ReactNode; defaultTheme?: string; storageKey?: string };
export type ThemeProviderState = { theme: string; setTheme: (theme: string) => void };
const initialState: ThemeProviderState = { theme: 'system', setTheme: () => null };
const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

function getThemeClass(themeName: string | undefined) { return themeName ? themeName.toLowerCase().replace(/\s+/g, '-') : 'light'; }

export function ThemeProvider({ children, defaultTheme = 'Light', storageKey = 'theme', ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(defaultTheme);
  React.useEffect(() => { setThemeState(localStorage.getItem(storageKey) || defaultTheme); }, [storageKey, defaultTheme]);
  React.useEffect(() => {
    const body = document.body;
    themes.forEach(t => body.classList.remove(getThemeClass(t.name)));
    body.classList.remove('light','dark');
    const effective = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light') : theme;
    body.classList.add(getThemeClass(effective));
    const doc = document.documentElement;
    doc.classList.remove('light','dark');
    const darkThemes = ['dark','matrix','batman','spider-man','iron-man','hulk','harry-potter','pirates-of-the-caribbean','stranger-things','dark-web-series'];
    doc.classList.add(darkThemes.includes(getThemeClass(effective)) ? 'dark' : 'light');
  }, [theme]);
  const value: ThemeProviderState = { theme, setTheme: (newTheme: string) => { localStorage.setItem(storageKey, newTheme); setThemeState(newTheme); } };
  return <ThemeProviderContext.Provider {...props} value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme(): ThemeProviderState {
  return React.useContext(ThemeProviderContext);
}
