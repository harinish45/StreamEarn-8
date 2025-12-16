
import { aiToolsPyramid, toolSubLabels, type AiTool } from '@/lib/ai-tools-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: AiTool;
  subLabel?: string;
}

const ToolCard = ({ tool, subLabel }: ToolCardProps) => (
  <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
    <div className="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center transition-colors group-hover:border-primary p-1">
      {tool.logo}
    </div>
    <p className="font-semibold text-xs transition-colors group-hover:text-primary text-white">{tool.name}</p>
    {subLabel && <p className="text-[10px] text-muted-foreground">{subLabel}</p>}
  </Link>
);

export function AiToolsPyramid({ searchQuery }: { searchQuery: string }) {

  const filteredCategories = aiToolsPyramid.map(category => ({
    ...category,
    tools: category.tools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(category => category.tools.length > 0);

  if (filteredCategories.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {filteredCategories.map((category, index) => (
        <div key={category.name} className="w-full flex flex-col items-center">
          <div className="flex justify-center flex-wrap gap-4 items-start p-4">
            {category.tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} subLabel={toolSubLabels[tool.name]} />
            ))}
          </div>
          <div className="flex items-center w-full max-w-lg my-4">
            <div className="h-px flex-1 bg-border" />
            <p className="text-sm text-muted-foreground px-4 flex-shrink-0">{category.name}</p>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
