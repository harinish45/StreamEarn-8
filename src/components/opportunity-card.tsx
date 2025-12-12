
import type { Opportunity } from "@/lib/data";
import { ArrowUpRight, Pin } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg border border-border shadow-sm transition-all hover:shadow-lg hover:shadow-primary/20 bg-card">
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg leading-tight truncate pr-8">{opportunity.title}</h3>
            <a
              href={opportunity.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onClick(opportunity.id)}
            >
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-1 truncate">{opportunity.description}</p>
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
