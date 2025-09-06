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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Search, Shield, LogOut, Rocket } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold font-headline">StreamEarn</h1>
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
        <div className="flex items-center gap-2 p-2 mt-2">
          <Avatar>
            <AvatarImage src="https://picsum.photos/100/100" alt="User" data-ai-hint="person face"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-muted-foreground">Pro Member</p>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
