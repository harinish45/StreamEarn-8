'use client';

import React, { useState, useEffect } from 'react';
import type { Task } from '@/types/blitzit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Pause, Play, Redo, X } from 'lucide-react';

interface FocusViewProps {
  activeTask: Task;
  allTasks: Task[];
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export function FocusView({ activeTask, allTasks, onClose }: FocusViewProps) {
  const initialDuration = (activeTask.estimatedTime || 60) * 60; // default to 60 mins
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setTimeLeft((activeTask.estimatedTime || 60) * 60);
    setIsRunning(true);
  }, [activeTask]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);
  
  const togglePlayPause = () => {
    setIsRunning(!isRunning);
  }

  const resetTimer = () => {
    setTimeLeft(initialDuration);
    setIsRunning(true);
  }

  const progress = (timeLeft / initialDuration) * 100;
  
  const upNextTasks = allTasks
    .filter(t => t.status === 'do-now' && t.id !== activeTask.id)
    .slice(0, 3);
  
  const doneTasks = allTasks.filter(t => t.status === 'done').slice(0, 2);

  return (
    <div className="h-full w-full bg-background p-8 flex flex-col items-center justify-center text-foreground relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-8 right-8 text-muted-foreground hover:text-foreground"
      >
        <X className="h-6 w-6" />
      </Button>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl text-center"
      >
        <p className="text-xl text-muted-foreground mb-2">Focusing on</p>
        <h1 className="text-5xl font-bold mb-12">{activeTask.title}</h1>

        <div className="relative mb-12 flex justify-center items-center">
            <svg className="w-80 h-80 transform -rotate-90">
                <circle
                    cx="160"
                    cy="160"
                    r="150"
                    strokeWidth="10"
                    className="stroke-muted"
                    fill="transparent"
                />
                 <motion.circle
                    cx="160"
                    cy="160"
                    r="150"
                    strokeWidth="10"
                    className="stroke-primary"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 150}
                    strokeDashoffset={(2 * Math.PI * 150) * (1 - progress / 100)}
                    transition={{ duration: 1, ease: 'linear' }}
                    strokeLinecap="round"
                />
            </svg>
             <div className="absolute flex flex-col items-center">
                <span className="text-7xl font-mono tracking-tighter">{formatTime(timeLeft)}</span>
            </div>
        </div>

         <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" className="rounded-full h-16 w-16" onClick={resetTimer}>
              <Redo className="h-8 w-8" />
          </Button>
          <Button size="lg" className="rounded-full h-16 w-16" onClick={togglePlayPause}>
            <AnimatePresence mode="wait">
              {isRunning ? (
                <motion.div key="pause" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Pause className="h-8 w-8" />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Play className="h-8 w-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          <Button variant="secondary" size="lg" className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 text-white">
              <Check className="h-8 w-8" />
          </Button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 w-full max-w-6xl mx-auto flex justify-between gap-8">
        <div className="w-1/3">
            <h3 className="font-semibold mb-3">Up Next</h3>
            <div className="space-y-2">
                {upNextTasks.map(task => (
                    <Card key={task.id} className="p-3 bg-card/50">
                        <p className="font-medium truncate">{task.title}</p>
                    </Card>
                ))}
            </div>
        </div>
         <div className="w-1/3">
            <h3 className="font-semibold mb-3">Done</h3>
            <div className="space-y-2">
                 {doneTasks.map(task => (
                    <Card key={task.id} className="p-3 bg-card/50">
                        <p className="font-medium truncate line-through text-muted-foreground">{task.title}</p>
                    </Card>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
}
