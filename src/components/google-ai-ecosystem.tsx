'use client';

import { type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { placeholderImages } from '@/lib/placeholder-images';

const ToolCard = ({ tool, isLastInRow }: { tool: GoogleAiTool; isLastInRow: boolean }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const image = placeholderImages[tool.imageKey];

  return (
    <div className="relative flex items-center justify-between group">
      <div className="flex flex-col items-start text-left w-1/2 pr-4">
        <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-sm tracking-wider uppercase hover:underline">
          {tool.name}
        </Link>
        <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
      </div>

      <div className="relative w-1/2 flex items-center">
        {/* Connector from text to image */}
        {isClient && <div className="absolute right-full h-px w-4 bg-primary/30 mr-2"></div>}
        
        <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="w-full">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-card bg-black transition-all group-hover:border-primary/50 group-hover:shadow-lg">
              <Image
                src={image.src}
                alt={tool.name}
                width={image.width}
                height={image.height}
                className="object-cover"
                data-ai-hint={tool.aiHint}
              />
            </div>
        </Link>

        {/* Connector from image to next item */}
        {!isLastInRow && isClient && <div className="absolute left-full h-px w-4 bg-primary/30 ml-2"></div>}
      </div>
    </div>
  );
};


export function GoogleAiEcosystem({ searchQuery, googleAiTools = [] }: { searchQuery: string, googleAiTools: GoogleAiTool[] }) {
  const filteredTools = googleAiTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredTools.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="relative my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start gap-x-8 gap-y-8">
        {filteredTools.map((tool, index) => (
            <ToolCard 
              key={tool.name} 
              tool={tool}
              isLastInRow={(index + 1) % 4 === 0}
            />
        ))}
      </div>
    </div>
  );
}
