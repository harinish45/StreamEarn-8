
'use client';

import { type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const ToolCard = ({ tool }: { tool: GoogleAiTool }) => {
  const [animationDelay, setAnimationDelay] = useState('0s');

  useEffect(() => {
    // Math.random() is safe here because it runs only on the client after hydration.
    setAnimationDelay(`${Math.random() * 2}s`);
  }, []);

  return (
    <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="relative group">
      <div className="grid grid-cols-2 gap-4 items-center h-full">
        <div className="space-y-1">
          <h3 className="font-bold text-primary">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
        
        <div 
          className="absolute top-1/2 h-px w-1/4 bg-primary/30 animate-breathing-glow left-[45%] transform"
          style={{ animationDelay }}
        ></div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-primary/20 bg-black transition-colors group-hover:border-primary/50">
          <Image
            src={tool.image}
            alt={tool.name}
            fill
            className="object-contain p-2"
            data-ai-hint={tool.aiHint}
          />
        </div>
      </div>
    </Link>
  );
};


export function GoogleAiEcosystem({ searchQuery, googleAiTools }: { searchQuery: string, googleAiTools: GoogleAiTool[] }) {
  const filteredTools = googleAiTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredTools.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="relative my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start gap-x-12 gap-y-8">
        {filteredTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
}
