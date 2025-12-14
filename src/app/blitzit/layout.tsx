'use client';

import React, { useState } from 'react';
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import type { Task } from '@/types/blitzit';
import { FocusView } from './components/FocusView';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleStartFocus = (task: Task, tasks: Task[]) => {
    setActiveFocusTask(task);
    setAllTasks(tasks);
  };
  
  const handleStopFocus = () => {
    setActiveFocusTask(null);
  };

  const handleCompleteFocus = () => {
    if (activeFocusTask) {
        toast({
            title: "🎉 Great work!",
            description: `You've completed "${activeFocusTask.title}".`,
        });
    }
    setActiveFocusTask(null);
  }
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && 'onStartFocus' in child.props) {
      // This is a bit of a hack to pass props to the page component
      // A better solution would be to use a context provider
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
        </div>
         <AnimatePresence>
            {activeFocusTask && (
                <FocusView 
                    activeTask={activeFocusTask} 
                    onClose={handleStopFocus} 
                    onComplete={handleCompleteFocus}
                />
            )}
        </AnimatePresence>
        <Toaster />
    </div>
  );
}
