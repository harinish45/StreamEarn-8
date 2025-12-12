
import type { LeadAutomationTool } from "@/lib/lead-automation-data";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface LeadAutomationCardProps {
  tool: LeadAutomationTool;
}

export function LeadAutomationCard({ tool }: LeadAutomationCardProps) {
  return (
    <Link 
      href={tool.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full w-full"
    >
      <div className="flex flex-col justify-between h-full w-full overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <Image
                    src={tool.logo}
                    alt={`${tool.title} logo`}
                    width={24}
                    height={24}
                    className="rounded-md object-contain"
                />
                <h3 className="font-semibold text-base">{tool.title}</h3>
            </div>
            {tool.recentlySeen && (
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
                Recently Seen
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{tool.description}</p>
        </div>
        <Button variant="default" className="w-full mt-4 bg-primary/80 hover:bg-primary text-primary-foreground">
          Visit Website
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}
