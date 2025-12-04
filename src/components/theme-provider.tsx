"use client"

import * as React from "react"
import { themes, type Theme } from "@/lib/themes"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: themes[0],
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => {
      if (typeof window === "undefined") {
        return themes[0];
      }
      const storedTheme = window.localStorage.getItem("theme");
      return themes.find(t => t.name.toLowerCase() === storedTheme) || themes[0];
    }
  );

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(...themes.map(t => t.name.toLowerCase()))
    root.classList.add(theme.name.toLowerCase())
    localStorage.setItem("theme", theme.name.toLowerCase());
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
