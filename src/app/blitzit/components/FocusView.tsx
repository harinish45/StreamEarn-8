'use client';

import React, { useState, useEffect } from 'react';
import type { Task } from '@/types/blitzit';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Pause, Play, Redo, X } from 'lucide-react';

interface FocusViewProps {
  activeTask: Task;
  onClose: () => void;
  onComplete: () => void;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export function FocusView({ activeTask, onClose, onComplete }: FocusViewProps) {
  const initialDuration = (activeTask.estimatedTime || 25) * 60; // default to 25 mins
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setTimeLeft((activeTask.estimatedTime || 25) * 60);
    setIsRunning(true);
  }, [activeTask]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
        if (timeLeft <= 0) {
            onComplete();
        }
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);
  
  const togglePlayPause = () => {
    setIsRunning(!isRunning);
  }

  const resetTimer = () => {
    setTimeLeft(initialDuration);
    setIsRunning(true);
  }

  const progress = (timeLeft / initialDuration) * 100;
  
  return (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50 w-full max-w-sm rounded-2xl bg-card/80 p-6 shadow-2xl backdrop-blur-lg border border-border"
    >
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-sm text-muted-foreground">Focusing on</p>
                <h2 className="text-xl font-semibold text-foreground">{activeTask.title}</h2>
            </div>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-2" onClick={onClose}>
                <X className="h-5 w-5"/>
            </Button>
        </div>
        
        <div className="relative mb-6 flex justify-center items-center">
            <svg className="w-48 h-48 transform -rotate-90">
                <circle
                    cx="96"
                    cy="96"
                    r="88"
                    strokeWidth="10"
                    className="stroke-muted"
                    fill="transparent"
                />
                 <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    strokeWidth="10"
                    className="stroke-primary"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={(2 * Math.PI * 88) * (1 - progress / 100)}
                    transition={{ duration: 1, ease: 'linear' }}
                    strokeLinecap="round"
                />
            </svg>
             <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-mono tracking-tighter">{formatTime(timeLeft)}</span>
            </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={resetTimer}>
              <Redo className="h-6 w-6" />
          </Button>
          <Button size="lg" className="rounded-full h-14 w-14" onClick={togglePlayPause}>
            <AnimatePresence mode="wait">
              {isRunning ? (
                <motion.div key="pause" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Pause className="h-7 w-7" />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Play className="h-7 w-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600 text-white" onClick={onComplete}>
              <Check className="h-6 w-6" />
          </Button>
        </div>
    </motion.div>
  );
}
