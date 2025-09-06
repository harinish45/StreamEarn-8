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
import { earningOpportunities } from "@/lib/data";
import { Button } from "./ui/button";
import { Search, LogOut } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SidebarInput placeholder="Search categories..." className="pl-8" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {earningOpportunities.map((category) => (
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
