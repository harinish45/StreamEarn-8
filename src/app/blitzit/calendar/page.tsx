
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { GamificationPanel } from '../components/GamificationPanel';
import { ReportsOverview } from '../components/ReportsOverview';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground">Schedule and view your tasks.</p>
            </header>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardContent className="p-0 h-full flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                             <div className="flex-1 p-4 flex items-center justify-center">
                                <ShadCalendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    month={currentDate}
                                    onMonthChange={setCurrentDate}
                                    className="p-0"
                                    classNames={{
                                        months: "w-full",
                                        month: "w-full",
                                        table: "w-full h-full",
                                        head_row: "grid grid-cols-7",
                                        row: "grid grid-cols-7",
                                        cell: "flex items-center justify-center h-16 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                        day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <GamificationPanel />
                    <ReportsOverview />
                </div>
            </div>
        </div>
    );
}
