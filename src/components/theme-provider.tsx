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
  const [theme, setTheme] = React.useState(
    () => (typeof window !== 'undefined' && localStorage.getItem(storageKey)) || defaultTheme
  );

  React.useEffect(() => {
    const body = window.document.body;
    
    // Remove all possible theme classes before adding the new one
    body.className = body.className.split(' ').filter(c => !themes.map(t => getThemeClass(t.name)).includes(c)).join(' ');

    let effectiveTheme = theme;
    if (theme === 'system') {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
    }

    const newThemeClass = getThemeClass(effectiveTheme);
    if(newThemeClass) {
      body.classList.add(newThemeClass);
    }
    
    // Also update the html element for shadcn dark mode compatibility
    const doc = window.document.documentElement;
    doc.classList.remove('light', 'dark');
    if (effectiveTheme === 'Dark' || effectiveTheme === 'Matrix' || effectiveTheme === 'Batman' || effectiveTheme === 'Iron Man' || effectiveTheme === 'Hulk') {
        doc.classList.add('dark');
    } else {
        doc.classList.add('light');
    }


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
