
'use client';

import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Settings } from "./Settings";
import { Integrations } from "./Integrations";

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[#475569] bg-[#0F172A] px-4 md:px-6">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex-1">
                {/* Potentially breadcrumbs here */}
            </div>

            <div className="relative flex-1 mx-4 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-10 bg-[#1E293B] border-transparent focus:border-[#6366F1] focus:ring-[#6366F1]" />
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                
                <Settings />
                <Integrations />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Avatar className="h-9 w-9 cursor-pointer">
                            <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#475569] text-[#E2E8F0]">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-[#475569]" />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <ThemeSwitcher />
                        <DropdownMenuSeparator className="bg-[#475569]" />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
