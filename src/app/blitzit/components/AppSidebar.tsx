'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Activity, 
    LayoutDashboard, 
    LifeBuoy, 
    LogOut, 
    Settings, 
    Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/blitzit", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/blitzit/reports", icon: Activity, label: "Reports" },
]

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-card p-4 border-r border-border">
            <div className="flex items-center gap-2 mb-8 px-2 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                <span className="font-bold text-xl text-foreground">Blitzit</span>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                     <Button 
                        key={item.label} 
                        variant="ghost" 
                        className={cn(
                            "justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 h-auto text-base",
                            pathname === item.href && "bg-accent text-foreground"
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    </Button>
                ))}
            </nav>

            <div className="flex flex-col gap-1 border-t border-border pt-4 mt-4">
                 <Button 
                    variant="ghost" 
                    className={cn(
                        "justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 h-auto",
                        pathname === "/blitzit/settings" && "bg-accent text-foreground"
                    )} 
                    asChild
                >
                    <Link href="/blitzit/settings">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </Button>
                 <Button variant="ghost" className="justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 h-auto">
                    <LifeBuoy className="h-5 w-5" />
                    <span>Help & Support</span>
                </Button>
                 <Button variant="ghost" className="justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 h-auto">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Button>
            </div>
        </aside>
    );
}
