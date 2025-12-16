'use client';
import type { Opportunity } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import placeholderImages from "@/lib/placeholder-images.json" with { type: "json" };

interface OpportunityCardProps {
  opportunity: Opportunity;
  categoryId: string;
}

export function OpportunityCard({ opportunity: initialOpportunity, categoryId }: OpportunityCardProps) {
    const [opportunity, setOpportunity] = useState(initialOpportunity);

    const handleClick = () => {
        // Optimistically update the UI
        if (!opportunity.visited) {
            setOpportunity(prev => ({...prev, visited: true}));
        }
    };
  
    const logo = placeholderImages[opportunity.logoKey as keyof typeof placeholderImages];

  return (
    <Link 
      href={opportunity.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative block h-full w-full"
    >
      <div className={cn(
          "themed-card flex flex-col justify-between h-full w-full overflow-hidden rounded-lg border p-4 transition-all hover:scale-105",
          "hover:border-accent"
        )}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                {logo && <Image
                    src={logo.src}
                    alt={`${opportunity.title} logo`}
                    width={logo.width}
                    height={logo.height}
                    className="rounded-md object-contain"
                    data-ai-hint="logo"
                />}
                <h3 className="font-semibold text-base whitespace-normal text-foreground">{opportunity.title}</h3>
            </div>
            {opportunity.visited && (
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30 text-xs">
                Seen
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] whitespace-normal">{opportunity.description}</p>
        </div>
        <button className="btn-main inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full mt-4">
          Visit Website
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </Link>
  );
}
