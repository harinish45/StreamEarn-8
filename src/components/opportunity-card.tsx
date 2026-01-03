'use client';
import type { Opportunity } from "@/lib/data";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import placeholderImages from "@/lib/placeholder-images.json" with { type: "json" };
import { Button } from "./ui/button";

interface OpportunityCardProps {
  opportunity: Opportunity;
  categoryId: string;
}

export function OpportunityCard({ opportunity: initialOpportunity, categoryId }: OpportunityCardProps) {
    const [opportunity, setOpportunity] = useState(initialOpportunity);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleVisitClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Stop propagation to prevent the main card link from firing if it's different
        e.stopPropagation();
        if (!opportunity.visited) {
            setOpportunity(prev => ({...prev, visited: true}));
        }
        // Then, open the link
        window.open(opportunity.link, '_blank', 'noopener,noreferrer');
    };

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(prev => !prev);
    };
  
    const logo = placeholderImages[opportunity.logoKey as keyof typeof placeholderImages];

  return (
    <div 
      className="group relative block h-full w-full"
      onClick={() => !opportunity.visited && setOpportunity(prev => ({...prev, visited: true}))}
    >
      <div className={cn(
          "themed-card flex flex-col justify-between h-full w-full overflow-hidden p-4 transition-all hover:scale-105",
          "hover:border-accent"
        )}>
        <div>
          <div className="flex items-start justify-between mb-2">
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
             <Button variant="ghost" size="icon" className="h-7 w-7 -mr-2 -mt-1" onClick={handleFavoriteClick}>
                <Star className={cn("h-5 w-5", isFavorited ? "fill-current text-yellow-400" : "text-muted-foreground")}/>
             </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] whitespace-normal mb-4">{opportunity.description}</p>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
                {opportunity.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
            </div>
            <a href={opportunity.link} onClick={handleVisitClick} className="text-muted-foreground hover:text-foreground">
                <ArrowUpRight className="h-5 w-5" />
            </a>
        </div>
      </div>
    </div>
  );
}
