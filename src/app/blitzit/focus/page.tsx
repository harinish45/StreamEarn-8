
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function FocusPage() {
    const router = useRouter();

    // This is a placeholder page. The actual focus mode is handled by the sidebar.
    // This page can be used to show a message or redirect.
    
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Card className="max-w-md">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold">Focus Mode is Active</h1>
                    <p className="text-muted-foreground mt-2 mb-4">
                        Your focus session is running. You can see the timer in the right sidebar.
                        You can continue to navigate through the app.
                    </p>
                    <Button onClick={() => router.push('/blitzit')}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
