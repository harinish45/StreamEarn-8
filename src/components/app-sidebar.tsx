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
import { Search, Shield, LogOut } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold font-headline">App Name</h1>
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
        <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <Label htmlFor="vpn-switch" className="text-sm font-medium">
              Secure Connection
            </Label>
          </div>
          <Switch id="vpn-switch" defaultChecked />
        </div>
        <div className="flex items-center justify-end p-2 mt-2">
          <Button variant="ghost" size="icon">
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
