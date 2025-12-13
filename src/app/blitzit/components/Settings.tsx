'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your Blitzit experience.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div>
            <Label className="mb-3 block">Theme</Label>
            <ThemeSwitcher />
          </div>
          <div>
             <Label className="mb-3 block">Pomodoro Presets</Label>
             <RadioGroup defaultValue="25">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25" id="p25"/>
                    <Label htmlFor="p25">25 min focus / 5 min break</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50" id="p50"/>
                    <Label htmlFor="p50">50 min focus / 10 min break</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom"/>
                    <Label htmlFor="custom">Custom</Label>
                </div>
             </RadioGroup>
          </div>
           <div>
             <Label className="mb-3 block">Quick Actions</Label>
             <div className="text-sm text-muted-foreground">
                 <p><span className="font-mono bg-muted p-1 rounded-md">Ctrl+K</span>: Focus search</p>
                 <p className="mt-1"><span className="font-mono bg-muted p-1 rounded-md">Ctrl+N</span>: New task</p>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}