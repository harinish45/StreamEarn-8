
import { googleAiTools, type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import Image from 'next/image';
import Link from 'next/link';

const ToolCard = ({ tool, side }: { tool: GoogleAiTool; side: 'left' | 'right' }) => {
  return (
    <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="relative group">
      <div className={`flex items-center gap-4 ${side === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-1">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border-2 border-primary/20 bg-black transition-colors group-hover:border-primary/50">
            <Image
              src={tool.image}
              alt={tool.name}
              fill
              className="object-contain p-2"
              data-ai-hint={tool.aiHint}
            />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-primary">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>
      <div 
        className={`absolute top-1/2 h-px w-1/4 bg-primary/30 ${side === 'left' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}
      />
    </Link>
  );
};

export function GoogleAiEcosystem() {
  const leftTools = googleAiTools.slice(0, 4);
  const rightTools = googleAiTools.slice(4);

  return (
    <div className="relative my-24">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-16 gap-y-12">
        {/* Left Column */}
        <div className="space-y-16">
          {leftTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} side="left" />
          ))}
        </div>

        {/* Center Column */}
        <div className="relative aspect-square w-full">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
            <div className="absolute inset-8 bg-black rounded-2xl shadow-2xl shadow-primary/20 border border-primary/20 flex items-center justify-center">
                <Image
                src="https://picsum.photos/seed/google-g-logo/200/200"
                width={150}
                height={150}
                alt="Google G Logo"
                className="animate-pulse"
                data-ai-hint="google logo"
                />
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-16">
          {rightTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} side="right" />
          ))}
        </div>
      </div>
    </div>
  );
}
