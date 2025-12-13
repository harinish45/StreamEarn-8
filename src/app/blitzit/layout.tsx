'use client';

import React from 'react';
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import { useTheme } from '@/components/theme-provider';

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  
  React.useEffect(() => {
    // This logic is now handled by the ThemeProvider,
    // but we can ensure the correct class is on the body for Blitzit specifically
    const body = document.body;
    const blitzitThemeClass = 'blitzit-dark'; // Use a specific class for this layout
    
    // Fallback to dark if no theme is set for some reason
    const currentTheme = theme || 'dark';
    
    // Clean up other theme classes if any
    body.classList.remove('light', 'dark', 'spider-man', 'batman', 'iron-man', 'superman', 'hulk');
    
    // Add the specific theme class for blitzit
    body.classList.add(blitzitThemeClass);

    return () => {
      body.classList.remove(blitzitThemeClass);
    };
  }, [theme]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
        <div className="flex">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    </div>
  );
}
