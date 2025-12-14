'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PomodoroSettings() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">Pomodoros</CardTitle>
                    <Switch id="pomodoro-enable" defaultChecked />
                </div>
                <CardDescription>Technique to work in fixed intervals & breaks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="work-sprint">Work sprint</Label>
                    <div className="flex items-center gap-2 w-24">
                        <Input id="work-sprint" type="number" defaultValue="60" className="w-16 text-center" />
                        <span className="text-muted-foreground text-sm">min</span>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="break">Break</Label>
                    <div className="flex items-center gap-2 w-24">
                        <Input id="break" type="number" defaultValue="15" className="w-16 text-center" />
                         <span className="text-muted-foreground text-sm">min</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
