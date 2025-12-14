'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Pause, Play, X, Star } from 'lucide-react';
import type { Task } from '@/types/blitzit';

interface FocusSidebarProps {
  activeTask: Task;
  onClose: () => void;
}

export function FocusSidebar({ activeTask, onClose }: FocusSidebarProps) {
  const [timeLeft, setTimeLeft] = useState((activeTask.estimatedTime || 25) * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setTimeLeft((activeTask.estimatedTime || 25) * 60);
    setIsActive(true);
  }, [activeTask]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  const progress = ((activeTask.estimatedTime || 25) * 60 - timeLeft) / ((activeTask.estimatedTime || 25) * 60) * 100;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 flex flex-col p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Star className="h-5 w-5"/> Focus Mode</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-muted"
                        strokeWidth="7"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                    />
                    <motion.circle
                        className="text-primary"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - progress / 100) }}
                        transition={{ duration: 1 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-4xl font-mono font-bold">{formatTime(timeLeft).substring(3)}</span>
                </div>
            </div>

            <div>
              <p className="text-muted-foreground">Focusing on:</p>
              <h3 className="text-2xl font-bold mt-1">{activeTask.title}</h3>
            </div>
            
             <div className="flex items-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setIsActive(!isActive)}>
                    {isActive ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {isActive ? 'Pause' : 'Resume'}
                </Button>
            </div>
        </div>

        <div className="mt-auto text-center">
            <Button variant="secondary" className="w-full">Mark as Complete</Button>
        </div>

      </motion.aside>
    </AnimatePresence>
  );
}
