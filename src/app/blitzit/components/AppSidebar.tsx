
'use client';
import Link from "next/link";
import { 
    Activity, 
    Calendar, 
    LayoutDashboard, 
    LifeBuoy, 
    LogOut, 
    Settings, 
    Share2, 
    Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/blitzit", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/blitzit/focus", icon: Star, label: "Focus Mode" },
    { href: "/blitzit/calendar", icon: Calendar, label: "Calendar" },
    { href: "/blitzit/reports", icon: Activity, label: "Reports" },
    { href: "/blitzit/integrations", icon: Share2, label: "Integrations" },
]

export function AppSidebar() {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-[#1E293B] p-4 border-r border-[#475569]">
            <div className="flex items-center gap-2 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF5E78]"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                <span className="font-bold text-xl text-white">Blitzit</span>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                     <Button key={item.label} variant="ghost" className="justify-start gap-3 text-[#94A3B8] hover:text-white hover:bg-white/5" asChild>
                        <Link href={item.href}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    </Button>
                ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-[#475569] pt-4">
                 <Button variant="ghost" className="justify-start gap-3 text-[#94A3B8] hover:text-white hover:bg-white/5">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </Button>
                 <Button variant="ghost" className="justify-start gap-3 text-[#94A3B8] hover:text-white hover:bg-white/5">
                    <LifeBuoy className="h-5 w-5" />
                    <span>Help & Support</span>
                </Button>
                 <Button variant="ghost" className="justify-start gap-3 text-[#94A3B8] hover:text-white hover:bg-white/5">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Button>
            </div>
        </aside>
    );
}
