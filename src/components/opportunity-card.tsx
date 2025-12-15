
'use client';
import type { Opportunity } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface OpportunityCardProps {
  opportunity: Opportunity;
  categoryId: string;
}

export function OpportunityCard({ opportunity, categoryId }: OpportunityCardProps) {
    const handleClick = async () => {
        try {
            await fetch(`/api/earnings/${categoryId}?opportunityId=${opportunity.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visited: true }),
            });
            // The UI will update on next page load/revalidation
        } catch (error) {
            console.error('Failed to mark as visited:', error);
        }
    };
  
  return (
    <Link 
      href={opportunity.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative block h-full w-full"
    >
      <div className="flex flex-col justify-between h-full w-full overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <Image
                    src={opportunity.logo}
                    alt={`${opportunity.title} logo`}
                    width={24}
                    height={24}
                    className="rounded-md object-contain"
                    data-ai-hint="logo"
                />
                <h3 className="font-semibold text-base whitespace-normal">{opportunity.title}</h3>
            </div>
            {opportunity.visited && (
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30 text-xs">
                Seen
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] whitespace-normal">{opportunity.description}</p>
        </div>
        <Button variant="default" className="w-full mt-4 bg-primary/80 hover:bg-primary text-primary-foreground">
          Visit Website
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}
