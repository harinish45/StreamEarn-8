'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';

export function Calendar() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ShadCalendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                />
            </CardContent>
        </Card>
    );
}