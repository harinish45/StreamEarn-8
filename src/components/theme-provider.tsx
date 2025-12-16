
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
  if (!themeName) return 'light';
  return themeName.toLowerCase().replace(/\s+/g, '-');
}

export function ThemeProvider({
  children,
  defaultTheme = 'Light',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(defaultTheme);

  React.useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey);
    // On initial load, use stored theme or default, but don't set 'system' directly
    const initialTheme = storedTheme || defaultTheme;
    setTheme(initialTheme);
  }, [storageKey, defaultTheme]);

  React.useEffect(() => {
    const body = window.document.body;
    
    // Remove all possible theme classes before adding the new one
    themes.forEach(t => {
      const themeClass = getThemeClass(t.name);
      if (themeClass) {
        body.classList.remove(themeClass);
      }
    });
    
    // remove light/dark from previous themes
    body.classList.remove('light', 'dark');

    let effectiveThemeName = theme;
    if (theme === 'system') {
        effectiveThemeName = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
    }

    const newThemeClass = getThemeClass(effectiveThemeName);
    if(newThemeClass) {
      body.classList.add(newThemeClass);
    }
    
    // Also update the html element for shadcn dark mode compatibility
    const doc = window.document.documentElement;
    doc.classList.remove('light', 'dark');
    
    const isDark = ['dark', 'matrix', 'batman', 'spider-man', 'iron-man', 'hulk'].includes(newThemeClass);
    if (isDark) {
        doc.classList.add('dark');
    } else {
        doc.classList.add('light');
    }

  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
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
