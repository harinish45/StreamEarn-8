
'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, FileText, BookOpen, Flag } from "lucide-react";

const menuItems = [
    { href: "/leads", label: "Leads", icon: <Users /> },
    { href: "/brokers", label: "Brokers", icon: <Users /> },
    { href: "/financials", label: "Financials", icon: <FileText /> },
    { href: "/rate-translator", label: "Rate Translator", icon: <Flag /> },
    { href: "/directory", label: "Directory", icon: <BookOpen /> },
];

export function CoursesSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
