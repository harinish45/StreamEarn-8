
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, Repeat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { Task } from '@/types/blitzit';

interface FocusTimerProps {
  task: Task;
  onStop: () => void;
}

export function FocusTimer({ task, onStop }: FocusTimerProps) {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Handle session end
          return 0;
        }
        // Visual/Sound Cue every 10 minutes (for demo, every 10 seconds)
        if ((duration - (prev - 1)) % 10 === 0) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 bg-[#1E293B] border-[#475569] shadow-2xl text-[#E2E8F0]">
           <motion.div 
            animate={{ scale: showAlert ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg"
            >
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-md font-medium">Focus: {task.title}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-[#94A3B8] hover:text-white" onClick={onStop}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-center mb-4">
              <p className="text-5xl font-mono font-bold text-white">{formatTime(timeLeft)}</p>
              <p className="text-sm text-[#94A3B8]">Pomodoro Session 1</p>
            </div>
            <Progress value={progress} className="mb-4 h-2 bg-[#475569]" />
            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-white" onClick={() => setTimeLeft(duration)}>
                <Repeat className="h-5 w-5" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="h-12 w-12 rounded-full bg-[#FF5E78] text-white hover:bg-[#FF5E78]/90" 
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
               <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-white" disabled>
                {/* Placeholder for skip */}
              </Button>
            </div>
          </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
