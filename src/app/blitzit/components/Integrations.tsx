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
import { Share2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

export function Integrations() {
  const integrations = [
    { name: 'Google Calendar', logo: 'https://picsum.photos/seed/gcal/40/40', active: true },
    { name: 'Notion', logo: 'https://picsum.photos/seed/notion/40/40', active: true },
    { name: 'ClickUp', logo: 'https://picsum.photos/seed/clickup/40/40', active: false },
    { name: 'Figma', logo: 'https://picsum.photos/seed/figma-int/40/40', active: false },
    { name: 'Trello', logo: 'https://picsum.photos/seed/trello/40/40', active: false },
    { name: 'Asana', logo: 'https://picsum.photos/seed/asana/40/40', active: false },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Integrations</SheetTitle>
          <SheetDescription>
            Connect Blitzit with your favorite apps.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <ul className="space-y-4">
            {integrations.map(int => (
              <li key={int.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src={int.logo} alt={`${int.name} logo`} width={32} height={32} className="rounded-md" data-ai-hint="logo" />
                  <span className="font-medium">{int.name}</span>
                </div>
                <Switch checked={int.active} />
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}