import Image from "next/image";
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <div className="relative h-[40vh] w-full overflow-hidden rounded-lg md:h-[50vh]">
      <Image
        src="https://picsum.photos/1600/900"
        alt="Featured Earning Opportunity"
        fill
        className="object-cover"
        priority
        data-ai-hint="digital money"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-foreground md:p-12">
        <h1 className="mb-4 max-w-2xl text-4xl font-bold text-white drop-shadow-md md:text-6xl">
          Unlock Your Earning Potential
        </h1>
        <p className="max-w-2xl text-white/90 drop-shadow-sm mb-6">
          Explore hundreds of opportunities to earn online.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg">
            <PlayCircle className="mr-2 h-5 w-5" />
            Get Started
          </Button>
          <Button size="lg" variant="secondary">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
