'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CreatorStudio } from '@/components/stream/creator-studio';
import { DEFAULT_STREAMS } from '@/lib/stream/mock-data';
import { StreamState } from '@/types/stream';

export default function CreatorPage() {
  const [currentStream] = useState(DEFAULT_STREAMS[0]);
  const [streamState, setStreamState] = useState<StreamState>('live');
  const [totalTipsEarned, setTotalTipsEarned] = useState<number>(315.5);

  const handleBroadcastAnnouncement = (announcement: string) => {
    // In a live system, this sends an event to the websocket/signaling channel
    alert(`Announcement Broadcasted: "${announcement}"`);
  };

  return (
    <>
      <Header showSidebarTrigger />
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <Breadcrumbs
          path={[
            { name: 'Creator Studio', href: '/creator' },
            { name: 'Broadcast & Monetization', href: '/creator' },
          ]}
        />

        <CreatorStudio
          currentStream={currentStream}
          streamState={streamState}
          onStateChange={setStreamState}
          onBroadcastAnnouncement={handleBroadcastAnnouncement}
          totalTipsEarned={totalTipsEarned}
        />
      </div>
    </>
  );
}
