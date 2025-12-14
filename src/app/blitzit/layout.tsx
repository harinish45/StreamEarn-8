'use client';

import React, { useState } from 'react';
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import type { Task } from '@/types/blitzit';
import { FocusView } from './components/FocusView';

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const handleStartFocus = (task: Task, tasks: Task[]) => {
    setActiveFocusTask(task);
    setAllTasks(tasks);
    setIsFocusMode(true);
  };
  
  const handleStopFocus = () => {
    setActiveFocusTask(null);
    setIsFocusMode(false);
  };
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.name === 'BlitzitPage') {
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
                    {isFocusMode && activeFocusTask ? (
                      <FocusView 
                        activeTask={activeFocusTask} 
                        allTasks={allTasks}
                        onClose={handleStopFocus} 
                      />
                    ) : (
                      childrenWithProps
                    )}
                </main>
            </div>
        </div>
    </div>
  );
}
