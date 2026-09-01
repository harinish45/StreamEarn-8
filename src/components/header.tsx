'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Bell, List, Grid, CircleUserRound, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import placeholderImages from "@/lib/placeholder-images.json" with { type: "json" };
import { createClient } from "@/lib/supabase/client";

interface HeaderProps { viewMode?: 'grid' | 'list'; setViewMode?: (mode: 'grid' | 'list') => void; searchQuery?: string; setSearchQuery?: (query: string) => void; showSidebarTrigger?: boolean; }

export function Header({ viewMode, setViewMode, searchQuery, setSearchQuery, showSidebarTrigger = false }: HeaderProps) {
  const showViewModeSwitcher = viewMode && setViewMode;
  const showSearch = searchQuery !== undefined && setSearchQuery;
  const userAvatar = placeholderImages.userAvatar;
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    setDateLabel(new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()));
  }, []);

  const handleLogout = async () => {
    try {
      await createClient().auth.signOut();
    } finally {
      window.location.assign('/login');
    }
  };

  return <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
    {showSidebarTrigger && <div className="md:hidden"><SidebarTrigger /></div>}
    <div className="flex flex-1 items-center gap-4">
      {showViewModeSwitcher && <div className="hidden items-center gap-2 md:flex"><div className="flex items-center gap-1 rounded-md bg-secondary p-1"><Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === 'grid' && "bg-background shadow")} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === 'list' && "bg-background shadow")} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button></div></div>}
    </div>
    <div className="flex items-center gap-2 md:gap-3">
      {showSearch && <div className="relative hidden md:block"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="w-48 bg-secondary pl-8 md:w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>}
      <span className="hidden rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground lg:inline-flex">{dateLabel || 'Today'}</span>
      <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-5 w-5" /><span className="sr-only">Notifications</span></Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full ring-offset-background transition hover:ring-2 hover:ring-primary/30"><Avatar className="h-9 w-9"><AvatarImage src={userAvatar.src} alt="Account" /><AvatarFallback>H</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="z-[100] w-[292px] max-w-[calc(100vw-20px)] rounded-2xl border bg-popover p-1.5 shadow-2xl backdrop-blur-xl">
          <div className="rounded-xl bg-muted/40 px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-1 ring-border"><AvatarImage src={userAvatar.src} alt="Account" /><AvatarFallback>H</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">My Account</div><div className="truncate text-xs text-muted-foreground">harinish@proton.me</div></div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Online</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground"><span className="inline-flex h-2 w-2 rounded-full bg-primary/70" />{dateLabel || 'Today'}<span className="ml-auto">Personal account</span></div>
          </div>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuLabel className="px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Account</DropdownMenuLabel>
          <DropdownMenuItem asChild className="rounded-xl"><Link href="/profile" className="flex cursor-pointer items-center gap-2"><CircleUserRound className="h-4 w-4" />Profile</Link></DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl"><Link href="/settings" className="flex cursor-pointer items-center gap-2"><Settings className="h-4 w-4" />Settings</Link></DropdownMenuItem>
          <ThemeSwitcher />
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-red-400 focus:bg-red-500/10 focus:text-red-300"><LogOut className="h-4 w-4" />Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>;
}
