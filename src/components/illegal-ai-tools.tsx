
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { illegalAiTools, type AiToolCategory, type AiTool } from '@/lib/illegal-ai-tools-data';
import Link from 'next/link';

function ToolListItem({ tool }: { tool: AiTool }) {
    return (
        <li>
            <Link 
                href={tool.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 relative pl-8 group"
            >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-muted-foreground transition-colors group-hover:bg-primary"></div>
                <div className="absolute left-0 top-0 h-full w-px bg-muted-foreground transition-colors group-hover:bg-primary"></div>
                <Image
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    width={24}
                    height={24}
                    className="rounded-md object-contain"
                    data-ai-hint="logo"
                />
                <span className="text-sm font-medium transition-colors group-hover:text-primary">{tool.name}</span>
            </Link>
        </li>
    );
}


function ToolList({ category }: { category: AiToolCategory }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-4">{category.name}</h3>
      <ul className="space-y-3">
        {category.tools.map((tool) => (
          <ToolListItem key={tool.name} tool={tool} />
        ))}
      </ul>
    </div>
  );
}

export function IllegalAiTools() {
  return (
    <div className="bg-black py-16 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
                <div className="inline-block bg-primary/20 border border-primary/50 rounded-lg px-6 py-2 mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">AI TOOLS THAT FEEL ILLEGAL TO KNOW FOR 2026</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {illegalAiTools.map(category => (
                    <ToolList key={category.name} category={category} />
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-muted-foreground">Created by Rene Remsik @aitrendz.xyz</p>
            </div>
        </div>
    </div>
  );
}
