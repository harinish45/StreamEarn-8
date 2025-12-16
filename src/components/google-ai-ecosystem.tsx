
'use client';

import { googleAiTools, type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import Image from 'next/image';
import Link from 'next/link';

const ToolCard = ({ tool }: { tool: GoogleAiTool }) => {
  return (
    <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="relative group">
      <div className="flex flex-col gap-4 h-full">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border-2 border-primary/20 bg-black transition-colors group-hover:border-primary/50">
            <Image
              src={tool.image}
              alt={tool.name}
              fill
              className="object-contain p-2"
              data-ai-hint={tool.aiHint}
            />
          </div>
        <div className="space-y-1">
          <h3 className="font-bold text-primary">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
};

export function GoogleAiEcosystem({ searchQuery }: { searchQuery: string }) {

  const filteredTools = googleAiTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredTools.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="relative my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start gap-8">
        {filteredTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
}
