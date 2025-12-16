
import Image from 'next/image';
import { illegalAiTools, type AiToolCategory, type AiTool } from '@/lib/illegal-ai-tools-data';
import Link from 'next/link';
import { AiToolsPyramid } from './ai-tools-pyramid';

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
                 <div className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center transition-colors group-hover:border-primary p-1">
                    {tool.logo && (
                        <Image
                            src={tool.logo}
                            alt={`${tool.name} logo`}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                            data-ai-hint="logo"
                        />
                    )}
                </div>
                <span className="text-sm font-medium text-white transition-colors group-hover:text-primary">{tool.name}</span>
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

export function IllegalAiTools({ searchQuery }: { searchQuery: string }) {

  const filteredCategories = illegalAiTools.map(category => ({
    ...category,
    tools: category.tools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(category => category.tools.length > 0);

  const shouldShowIllegalTools = !(filteredCategories.length === 0 && searchQuery);

  return (
    <div className="bg-black py-16 px-4 md:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-4">
                <div className="inline-block bg-primary/20 border border-primary/50 rounded-lg px-6 py-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">AI TOOLS THAT FEEL ILLEGAL TO KNOW FOR 2026</h2>
                </div>
                {shouldShowIllegalTools && 
                    <p className="mt-4 text-xl font-serif text-white">15 AI tools every solo founder needs to know about</p>
                }
            </div>

            {shouldShowIllegalTools && 
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredCategories.map(category => (
                        <ToolList key={category.name} category={category} />
                    ))}
                </div>
            }
            
            <div className="pt-8">
                 <p className="mt-4 text-center text-xl font-serif text-white">15 AI tools every solo founder needs to know about</p>
                <AiToolsPyramid searchQuery={searchQuery} />
            </div>
        </div>
    </div>
  );
}
