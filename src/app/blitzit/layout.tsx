
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
  const { setTheme } = useTheme();

  React.useEffect(() => {
    // Force Blitzit theme on mount
    document.documentElement.classList.add('blitzit-dark');
    return () => {
      // Cleanup on unmount
      document.documentElement.classList.remove('blitzit-dark');
    };
  }, []);


  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <div className="flex flex-1">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    </div>
  );
}
