
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function GamificationPanel() {
  return (
    <Card className="bg-[#1E293B] border-[#475569]">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
            <CardDescription>Keep completing tasks to level up!</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between font-mono text-sm">
                        <span>Level 5</span>
                        <span className="text-muted-foreground">Level 6</span>
                    </div>
                    <Progress value={60} className="h-2 bg-[#475569]"/>
                    <p className="text-xs text-muted-foreground text-center">1200 / 2000 XP</p>
                </div>
                <div className="flex justify-around text-center border-t border-b border-[#475569] py-4">
                        <div>
                            <p className="font-bold text-2xl text-[#FF5E78]">12</p>
                            <p className="text-xs text-muted-foreground">Day Streak</p>
                        </div>
                        <div>
                            <p className="font-bold text-2xl text-[#6366F1]">2</p>
                            <p className="text-xs text-muted-foreground">Week Streak</p>
                        </div>
                </div>
                <div>
                    <h5 className="font-semibold mb-3 text-base">Badges</h5>
                    <div className="flex gap-4">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center ring-2 ring-yellow-600/50" title="First Task">
                            <Award className="h-7 w-7 text-yellow-500"/>
                        </div>
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center ring-2 ring-green-500/50" title="Week Warrior">
                            <TrendingUp className="h-7 w-7 text-green-400"/>
                        </div>
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center ring-2 ring-blue-500/50" title="Focus Master">
                            <Star className="h-7 w-7 text-blue-400"/>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
