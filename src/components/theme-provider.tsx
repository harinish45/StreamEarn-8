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

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

function getThemeClass(themeName: string | undefined) {
  if (!themeName) return 'dark';
  return themeName.toLowerCase().replace(/\s+/g, '-');
}

export function ThemeProvider({
  children,
  defaultTheme = 'Dark',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(
    () => (typeof window !== 'undefined' && localStorage.getItem(storageKey)) || defaultTheme
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all possible theme classes
    themes.forEach(t => {
      root.classList.remove(getThemeClass(t.name));
    });
    // also remove legacy blitzit-dark
    root.classList.remove('blitzit-dark');

    let effectiveTheme = theme;
    if (theme === 'system') {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
    }

    const newThemeClass = getThemeClass(effectiveTheme);
    root.classList.add(newThemeClass);

  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
