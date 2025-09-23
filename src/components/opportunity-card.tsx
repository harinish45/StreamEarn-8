
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
    <div className="group relative h-full w-full overflow-hidden rounded-md">
       <a
        href={opportunity.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={() => onClick(opportunity.id)}
      >
        <div className="aspect-[3/2] transition-all duration-300 ease-in-out">
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={opportunity.aiHint}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="font-semibold text-base">{opportunity.description}</p>
        </div>
        <div className="absolute right-2 top-2 translate-y-2 transform rounded-full bg-primary/80 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
        </div>
        {opportunity.visited && (
           <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md">
            Visited
          </div>
        )}
      </a>
      <Button variant="ghost" size="icon" className="absolute left-2 top-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <Pin className="h-4 w-4" />
      </Button>
    </div>
  );
}
