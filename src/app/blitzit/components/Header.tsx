
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
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-8">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex-1">
                {/* Potentially breadcrumbs here */}
            </div>

            <div className="relative flex-1 mx-auto max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-10 bg-card border-transparent focus:border-secondary focus:ring-secondary" />
            </div>

            <div className="flex items-center gap-2">
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
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <ThemeSwitcher />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
