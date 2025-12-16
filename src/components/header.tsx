
'use client';

import { Search, Bell, List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import React from 'react';

interface HeaderProps {
    viewMode?: 'grid' | 'list';
    setViewMode?: (mode: 'grid' | 'list') => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

export function Header({ 
  viewMode, 
  setViewMode, 
  searchQuery, 
  setSearchQuery 
}: HeaderProps) {

  const showViewModeSwitcher = !!(viewMode && setViewMode);
  const showSearch = !!(searchQuery !== undefined && setSearchQuery);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex flex-1 items-center gap-4">
        {showViewModeSwitcher && (
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
              <Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === 'grid' && "bg-background shadow")} onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === 'list' && "bg-background shadow")} onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 bg-secondary pl-8 md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/100/100" alt="User" data-ai-hint="person face" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeSwitcher />
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
