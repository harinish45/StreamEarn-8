'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, X, Forward, Repeat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function FocusTimer() {
  const [isFocusing, setIsFocusing] = useState(true); // To show a sample timer
  const [isPaused, setIsPaused] = useState(true);
  const [progress, setProgress] = useState(40); // Sample progress

  if (!isFocusing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 bg-background/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-md">Focus: Design Landing Page</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsFocusing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-center mb-4">
              <p className="text-5xl font-mono font-bold">15:32</p>
              <p className="text-sm text-muted-foreground">Pomodoro Session 1</p>
            </div>
            <Progress value={progress} className="mb-4 h-2" />
            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="icon">
                <Repeat className="h-5 w-5" />
              </Button>
              <Button variant="primary" size="icon" className="h-12 w-12 rounded-full" onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Forward className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}