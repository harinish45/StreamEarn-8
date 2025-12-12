
import { aiToolsPyramid, toolSubLabels, type AiTool } from '@/lib/ai-tools-data';

interface ToolCardProps {
  tool: AiTool;
  subLabel?: string;
}

const ToolCard = ({ tool, subLabel }: ToolCardProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-24 h-24 bg-card border border-border rounded-lg flex items-center justify-center">
      {tool.logo}
    </div>
    <p className="font-semibold text-sm">{tool.name}</p>
    {subLabel && <p className="text-xs text-muted-foreground">{subLabel}</p>}
  </div>
);

export function AiToolsPyramid() {
  return (
    <div className="flex flex-col items-center gap-4">
      {aiToolsPyramid.map((category, index) => (
        <div key={category.name} className="w-full flex flex-col items-center">
          <div className="flex justify-center flex-wrap gap-4 md:gap-8 items-start">
            {category.tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} subLabel={toolSubLabels[tool.name]} />
            ))}
          </div>
          <div className="flex items-center w-full my-4">
            { index < aiToolsPyramid.length -1 && <div className="h-px flex-1 bg-border" />}
            <p className="text-sm text-muted-foreground px-4 flex-shrink-0">{category.name}</p>
            { index < aiToolsPyramid.length -1 && <div className="h-px flex-1 bg-border" />}
          </div>
        </div>
      ))}
    </div>
  );
}
