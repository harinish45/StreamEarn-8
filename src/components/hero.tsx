import Image from "next/image";

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
    </div>
  );
}
