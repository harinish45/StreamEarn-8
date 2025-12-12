
import type { Opportunity } from "@/lib/data";
import { ArrowUpRight, Pin } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg border border-border shadow-sm transition-all hover:shadow-lg hover:shadow-primary/20 bg-card">
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
              <Image
                src={opportunity.logo}
                alt={`${opportunity.title} logo`}
                width={40}
                height={40}
                className="rounded-md object-contain"
                data-ai-hint="logo"
              />
              <h3 className="font-bold text-lg leading-tight">{opportunity.title}</h3>
            </div>
            <a
              href={opportunity.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onClick(opportunity.id)}
              className="mt-1"
            >
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{opportunity.description}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pin className="h-4 w-4" />
          </Button>
          {opportunity.visited && (
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              Visited
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
