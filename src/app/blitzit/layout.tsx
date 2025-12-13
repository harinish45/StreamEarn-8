
'use client';

import React from 'react';
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    document.documentElement.classList.add('blitzit-dark');
    return () => {
      document.documentElement.classList.remove('blitzit-dark');
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
        <div className="flex">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    </div>
  );
}
