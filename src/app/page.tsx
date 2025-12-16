import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">
                StreamEarn
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/earnings"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Earnings
              </Link>
              <Link
                href="/ai-tools"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                AI Tools
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-serif tracking-tighter sm:text-5xl xl:text-6xl/none text-accent">
                Your Gateway to Online Earning
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Discover a world of opportunities. Our platform connects you with the best ways to earn online, from micro-tasks and freelancing to AI-powered ventures.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row flex-wrap">
                <Link href="/earnings" className={cn("btn-main", "inline-flex items-center justify-center h-11 rounded-md px-8 text-sm font-medium")}>
                    Explore Earning Opportunities
                </Link>
                <Link href="/ai-tools" className={cn("btn-main", "inline-flex items-center justify-center h-11 rounded-md px-8 text-sm font-medium")}>
                    Discover AI Tools
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
                <Image
                    src="https://picsum.photos/seed/future/800/600"
                    width={800}
                    height={600}
                    alt="Abstract business image"
                    className="rounded-xl shadow-2xl object-cover"
                    data-ai-hint="futuristic abstract"
                />
            </div>
          </div>
        </div>
      </main>

       <footer className="border-t border-border">
          <div className="container flex flex-col md:flex-row items-center justify-between py-4 text-sm text-muted-foreground">
              <p>&copy; 2024 StreamEarn. All rights reserved.</p>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                  <Link href="#" className="hover:text-foreground">Privacy</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}
