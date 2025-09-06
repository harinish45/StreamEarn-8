
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
import { Search, LogOut, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface AppSidebarProps {
    categories: EarningCategory[];
    onSortClick: () => void;
    sortOrder: 'asc' | 'desc';
}

export function AppSidebar({ categories, onSortClick, sortOrder }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SidebarInput placeholder="Search categories..." className="pl-8" />
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
          {categories.map((category) => (
            <SidebarMenuItem key={category.id}>
              <SidebarMenuButton asChild tooltip={category.name}>
                <a href={`#${category.id}`}>
                  <category.icon />
                  <span>{category.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
