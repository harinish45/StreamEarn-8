'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Repeat, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FocusPage() {
    const [duration, setDuration] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isPaused, setIsPaused] = useState(true);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsPaused(true);
                    // Add sound alert and celebration here
                    return 0;
                }
                // Visual/Sound Cue every 10 minutes
                if ((duration - (prev - 1)) % (10 * 60) === 0) {
                   // Add visual pulse/sound alert
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

    const resetTimer = () => {
        setIsPaused(true);
        setTimeLeft(duration);
    };

    const progress = ((duration - timeLeft) / duration) * 100;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-background text-foreground p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <h2 className="text-xl text-muted-foreground mb-2">Focusing on:</h2>
                <h1 className="text-4xl font-bold mb-8">Design the new landing page</h1>

                <div className="relative mb-8">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            className="text-card"
                            strokeWidth="7"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                        <motion.circle
                            className="text-primary"
                            strokeWidth="7"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-7xl font-mono font-bold">{formatTime(timeLeft)}</p>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground hover:text-foreground" onClick={resetTimer}>
                        <Repeat className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="default"
                        className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg hover:scale-105 transition-transform"
                        onClick={() => setIsPaused(!isPaused)}
                    >
                        <AnimatePresence mode="wait">
                            {isPaused ? (
                                <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                    <Play className="h-10 w-10" />
                                </motion.div>
                            ) : (
                                <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                    <Pause className="h-10 w-10" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground hover:text-foreground" onClick={() => {}}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <p className="text-muted-foreground mt-4">Pomodoro Session 1/4</p>
            </motion.div>
        </div>
    );
}
