'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Award, Star, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function GamificationPanel() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Star className="mr-2 h-4 w-4 text-yellow-400" />
          Level 5
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Your Progress</h4>
            <p className="text-sm text-muted-foreground">
              Keep completing tasks to level up!
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <span>Level 5</span>
                <span className="text-sm text-muted-foreground">Level 6</span>
            </div>
            <Progress value={60} className="h-2"/>
            <p className="text-xs text-muted-foreground text-center">1200 / 2000 XP</p>
          </div>
           <div className="flex justify-around text-center">
                <div>
                    <p className="font-bold text-lg">12</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div>
                    <p className="font-bold text-lg">2</p>
                    <p className="text-xs text-muted-foreground">Week Streak</p>
                </div>
            </div>
          <div>
            <h5 className="font-medium mb-2">Badges</h5>
            <div className="flex gap-2">
                <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center" title="First Task"><Award className="h-6 w-6 text-yellow-600"/></div>
                <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center" title="Week Warrior"><TrendingUp className="h-6 w-6 text-green-500"/></div>
                <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center" title="Focus Master"><Star className="h-6 w-6 text-blue-500"/></div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}