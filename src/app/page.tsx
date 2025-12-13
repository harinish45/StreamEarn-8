
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <MountainIcon className="h-6 w-6" />
              <span className="font-bold">OpportunityHub</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/dashboard"
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container relative py-12 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Trusted & Verified
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                The Smartest Way to Find Online Opportunities
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our platform combines verified listings, AI-powered insights, and direct connections to help you discover and capitalize on online earning opportunities.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/ai-tools">Discover AI Tools</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
                <Image
                    src="https://picsum.photos/seed/main-hero/800/600"
                    width={800}
                    height={600}
                    alt="Hero Image"
                    className="rounded-xl shadow-2xl"
                    data-ai-hint="digital landscape"
                />
            </div>
          </div>
        </div>
      </main>

       <footer className="border-t">
          <div className="container flex items-center justify-between py-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <p>&copy; 2024 OpportunityHub. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-4">
                  <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                  <Link href="#" className="hover:text-foreground">Privacy</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
