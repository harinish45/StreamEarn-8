'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Image from 'next/image';

const integrationsList = [
    { name: 'Google Calendar', logo: 'https://picsum.photos/seed/gcal/40/40', description: 'Two-way sync with your calendar.', connected: true },
    { name: 'Notion', logo: 'https://picsum.photos/seed/notion/40/40', description: 'Create/update pages from tasks.', connected: true },
    { name: 'ClickUp', logo: 'https://picsum.photos/seed/clickup/40/40', description: 'Sync with your ClickUp workspaces.', connected: false },
    { name: 'Figma', logo: 'https://picsum.photos/seed/figma-int/40/40', description: 'Attach Figma files to tasks.', comingSoon: true },
    { name: 'Trello', logo: 'https://picsum.photos/seed/trello/40/40', description: 'Sync with Trello boards.', comingSoon: true },
    { name: 'Asana', logo: 'https://picsum.photos/seed/asana/40/40', description: 'Manage Asana tasks.', comingSoon: true },
    { name: 'Linear', logo: 'https://picsum.photos/seed/linear/40/40', description: 'Integrate with Linear issues.', comingSoon: true },
];

export default function IntegrationsPage() {
    return (
        <div className="space-y-6">
             <header>
                <h1 className="text-3xl font-bold">Integrations</h1>
                <p className="text-muted-foreground">Connect Blitzit with your favorite tools.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrationsList.map((int) => (
                    <Card key={int.name}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Image src={int.logo} alt={`${int.name} logo`} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                                <CardTitle>{int.name}</CardTitle>
                            </div>
                            {int.connected !== undefined && <Switch checked={int.connected} />}
                            {int.comingSoon && <Button variant="outline" size="sm" disabled>Coming Soon</Button>}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{int.description}</p>
                            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                                {int.connected ? (
                                    <>
                                        <span>Last sync: 5 minutes ago</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : !int.comingSoon && (
                                     <Button variant="default" size="sm">Connect</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
