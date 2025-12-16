import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = placeholderImages.heroImage;
  return (
    <div className="relative h-[30vh] w-full overflow-hidden rounded-xl md:h-[40vh]">
      <Image
        src={heroImage.src}
        alt="Featured Earning Opportunity"
        fill
        className="object-cover"
        priority
        data-ai-hint="digital money"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
    </div>
  );
}
