
'use client';

import React from 'react';

// Placeholder for the main Blitzit dashboard component
const TaskManager = () => (
    <div className="p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Blitzit Productivity Suite</h1>
        <p className="text-muted-foreground">
            Welcome to Blitzit. The full suite of productivity tools is under construction.
        </p>
    </div>
);

export default function BlitzitPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="flex flex-1 items-center justify-between">
                        <a href="/" className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                        <span className="font-bold">StreamEarn</span>
                        </a>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                        <a href="/earnings" className="text-foreground/60 transition-colors hover:text-foreground/80">Earnings</a>
                        <a href="/ai-tools" className="text-foreground/60 transition-colors hover:text-foreground/80">AI Tools</a>
                        <a href="/blitzit" className="text-foreground/60 transition-colors hover:text-foreground/80">Blitzit</a>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1">
               <TaskManager />
            </main>
        </div>
    );
}
