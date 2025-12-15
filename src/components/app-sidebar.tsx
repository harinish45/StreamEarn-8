
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { EarningCategory } from "@/lib/data";
import { Button } from "./ui/button";
import { Search, LogOut, ArrowDownAZ, ArrowUpAZ, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface AppSidebarProps {
    categories: EarningCategory[];
    onSortClick: () => void;
    sortOrder: 'asc' | 'desc';
    onPinClick: (categoryId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function AppSidebar({ categories, onSortClick, sortOrder, onPinClick, searchQuery, setSearchQuery }: AppSidebarProps) {
  const pathname = usePathname();
  const sidebarCategories = categories.filter(c => c.id !== 'home' && c.id !== 'recently-watched');

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SidebarInput 
            placeholder="Search categories..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="flex items-center justify-end px-2 mb-2">
            <Button variant="ghost" size="sm" onClick={onSortClick}>
                Sort 
                {sortOrder === 'asc' ? <ArrowDownAZ className="ml-2 h-4 w-4" /> : <ArrowUpAZ className="ml-2 h-4 w-4" />}
            </Button>
        </div>
        <SidebarMenu>
          {sidebarCategories.map((category) => {
            const isActive = pathname === `/category/${category.id}`;
            return (
                <SidebarMenuItem key={category.id} className="group/menu-item">
                <SidebarMenuButton asChild tooltip={category.name} isActive={isActive}>
                    <Link href={`/category/${category.id}`}>
                    <category.icon />
                    <span>{category.name}</span>
                    </Link>
                </SidebarMenuButton>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/menu-item:opacity-100"
                    onClick={() => onPinClick(category.id)}
                >
                    <Pin className={cn("h-4 w-4", category.pinned && "fill-current text-foreground")} />
                </Button>
                </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center justify-end p-2 mt-2">
          <Button variant="ghost" size="icon">
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
