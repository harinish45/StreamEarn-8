'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, Bell, List, Grid, CircleUserRound, Settings, LogOut, Palette, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/theme-provider";
import { themes } from "@/lib/themes";
import placeholderImages from "@/lib/placeholder-images.json" with { type: "json" };

interface HeaderProps { viewMode?: 'grid' | 'list'; setViewMode?: (mode: 'grid' | 'list') => void; searchQuery?: string; setSearchQuery?: (query: string) => void; showSidebarTrigger?: boolean; }

export function Header({ viewMode, setViewMode, searchQuery, setSearchQuery, showSidebarTrigger = false }: HeaderProps) {
  const showViewModeSwitcher = viewMode && setViewMode;
  const showSearch = searchQuery !== undefined && setSearchQuery;
  const userAvatar = placeholderImages.userAvatar;
  const [dateLabel, setDateLabel] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setDateLabel(new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()));
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
        setThemeOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setThemeOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen]);

  const handleLogout = async () => {
    setAccountOpen(false);
    try { await createClient().auth.signOut(); } finally { window.location.assign('/login'); }
  };

  const chooseTheme = (name: string) => {
    setTheme(name);
    setThemeOpen(false);
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
      <div ref={accountRef} className="relative">
        <Button variant="ghost" size="icon" aria-haspopup="menu" aria-expanded={accountOpen} onClick={() => { setAccountOpen(v => !v); setThemeOpen(false); }} className="rounded-full ring-offset-background transition hover:ring-2 hover:ring-primary/30">
          <Avatar className="h-9 w-9"><AvatarImage src={userAvatar.src} alt="Account" /><AvatarFallback>H</AvatarFallback></Avatar>
        </Button>
        {accountOpen && <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-[200] w-[300px] max-w-[calc(100vw-16px)] overflow-visible rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl ring-1 ring-black/10 backdrop-blur-xl">
          <div className="rounded-xl bg-muted/40 px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 shrink-0 ring-1 ring-border"><AvatarImage src={userAvatar.src} alt="Account" /><AvatarFallback>H</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">My Account</div><div className="truncate text-xs text-muted-foreground">harinish@proton.me</div></div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Online</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground"><span className="inline-flex h-2 w-2 rounded-full bg-primary/70" />{dateLabel || 'Today'}<span className="ml-auto">Personal account</span></div>
          </div>
          <div className="my-1.5 h-px bg-border" />
          <div className="px-1">
            <Link href="/profile" role="menuitem" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"><CircleUserRound className="h-4 w-4" />Profile</Link>
            <Link href="/settings" role="menuitem" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"><Settings className="h-4 w-4" />Settings</Link>
            <button type="button" role="menuitem" aria-expanded={themeOpen} onClick={() => setThemeOpen(v => !v)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"><Palette className="h-4 w-4" /><span className="flex-1 text-left">Theme</span><span className="text-xs text-muted-foreground">{theme}</span><ChevronDown className={cn("h-4 w-4 transition-transform", themeOpen && "rotate-180")} /></button>
          </div>
          {themeOpen && <div className="mt-1 rounded-xl border border-border/80 bg-background/95 p-1.5 shadow-lg">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Choose theme</div>
            <div className="grid grid-cols-2 gap-1">
              {themes.map((t) => <button key={t.name} type="button" onClick={() => chooseTheme(t.name)} className={cn("flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition", theme === t.name ? "bg-primary/15 text-primary" : "hover:bg-accent hover:text-accent-foreground")}><span>{t.name}</span>{theme === t.name && <Check className="h-3.5 w-3.5" />}</button>)}
            </div>
          </div>}
          <div className="my-1.5 h-px bg-border" />
          <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"><LogOut className="h-4 w-4" />Logout</button>
        </div>}
      </div>
    </div>
  </header>;
}
