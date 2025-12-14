'use client';

import React from 'react';
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import { Toaster } from '@/components/ui/toaster';
import { FocusProvider } from './context/FocusProvider';

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FocusProvider>
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
          <Toaster />
      </div>
    </FocusProvider>
  );
}
