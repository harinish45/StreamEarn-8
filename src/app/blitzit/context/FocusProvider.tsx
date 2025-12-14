'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Task } from '@/types/blitzit';
import { FocusView } from '../components/FocusView';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FocusContextType {
  activeFocusTask: Task | null;
  allTasks: Task[];
  startFocus: (task: Task, allTasks: Task[]) => void;
  stopFocus: () => void;
  completeFocus: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const startFocus = (task: Task, tasks: Task[]) => {
    setActiveFocusTask(task);
    setAllTasks(tasks);
  };
  
  const stopFocus = () => {
    setActiveFocusTask(null);
  };

  const completeFocus = () => {
    if (activeFocusTask) {
        toast({
            title: "🎉 Great work!",
            description: `You've completed "${activeFocusTask.title}".`,
        });
    }
    setActiveFocusTask(null);
  }

  return (
    <FocusContext.Provider value={{ activeFocusTask, allTasks, startFocus, stopFocus, completeFocus }}>
      {children}
      <AnimatePresence>
        {activeFocusTask && (
            <FocusView 
                activeTask={activeFocusTask} 
                onClose={stopFocus} 
                onComplete={completeFocus}
            />
        )}
      </AnimatePresence>
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
}
