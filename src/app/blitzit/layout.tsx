
'use client';

import React, { useState } from 'react';
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import { useTheme } from '@/components/theme-provider';
import type { Task } from '@/types/blitzit';
import { FocusSidebar } from './components/FocusTimer';

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
  };
  
  const handleStopFocus = () => {
    setActiveFocusTask(null);
  };
  
  // We need to pass the start focus handler down to the children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // @ts-ignore
      return React.cloneElement(child, { onStartFocus: handleStartFocus });
    }
    return child;
  });

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
        <div className="flex">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-auto">
                    {childrenWithProps}
                </main>
            </div>
            {activeFocusTask && <FocusSidebar activeTask={activeFocusTask} onClose={handleStopFocus} />}
        </div>
    </div>
  );
}
