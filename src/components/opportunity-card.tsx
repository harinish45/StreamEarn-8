
import type { Opportunity } from "@/lib/data";
import Image from "next/image";
import { ArrowUpRight, Pin } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg border border-border shadow-sm transition-all hover:shadow-lg hover:shadow-primary/20">
       <a
        href={opportunity.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={() => onClick(opportunity.id)}
      >
        <div className="aspect-[3/2] overflow-hidden">
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            data-ai-hint={opportunity.aiHint}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg leading-tight truncate">{opportunity.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 truncate">{opportunity.description}</p>
        </div>
        <div className="absolute right-3 top-3 translate-y-2 transform rounded-full bg-black/50 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </div>
        {opportunity.visited && (
           <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Visited
          </div>
        )}
      </a>
      <Button variant="ghost" size="icon" className="absolute left-2 top-2 text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
        <Pin className="h-4 w-4" />
      </Button>
    </div>
  );
}
