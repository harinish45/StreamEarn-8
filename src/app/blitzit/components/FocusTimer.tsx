
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
  const [isPaused, setIsPaused] = useState(true);
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
        className="fixed bottom-6 right-6 z-50"
      >
        <Card className="w-80 bg-card border-border shadow-2xl text-foreground">
           <motion.div 
            animate={{ scale: showAlert ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg"
            >
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-md font-medium">Focus: {task.title}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onStop}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-center mb-4">
              <p className="text-5xl font-mono font-bold">{formatTime(timeLeft)}</p>
              <p className="text-sm text-muted-foreground">Pomodoro Session 1</p>
            </div>
            <Progress value={progress} className="mb-4 h-2 bg-muted/50" indicatorClassName="bg-primary" />
            <div className="flex justify-center items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setTimeLeft(duration)}>
                <Repeat className="h-5 w-5" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg hover:scale-105 transition-transform" 
                onClick={() => setIsPaused(!isPaused)}
              >
                <AnimatePresence mode="wait">
                    {isPaused ? (
                         <motion.div key="play" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                            <Play className="h-7 w-7" />
                         </motion.div>
                    ) : (
                        <motion.div key="pause" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}>
                            <Pause className="h-7 w-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
              </Button>
               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" disabled>
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
