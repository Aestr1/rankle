
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Trophy, Home, Info, HelpCircle, BarChart3, ShieldCheck, Users, Library, Globe, PlusCircle, UserPlus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { useAuth } from "@/contexts/auth-context";

const menuItems = [
  { href: "/", label: "Home", icon: Home, auth: false },
  { href: "/about", label: "About", icon: Info, auth: false },
  { href: "/faq", label: "FAQ", icon: HelpCircle, auth: false },
  { href: "/analytics", label: "Stats", icon: BarChart3, auth: true },
];

const groupItems = [
    { href: "/my-groups", label: "My Groups", icon: ShieldCheck, auth: true },
    { href: "/public-groups", label: "Browse Groups", icon: Globe, auth: false },
    { href: "/create-group", label: "Create Group", icon: PlusCircle, auth: true },
    { href: "/join-group", label: "Join Group", icon: UserPlus, auth: true },
];

const socialItems = [
    { href: "/friends", label: "Friends", icon: Users, auth: true },
    { href: "/games-library", label: "Games Library", icon: Library, auth: false },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
        return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const renderMenuItems = (items: typeof menuItems) => {
    return items.map((item) => {
        if (item.auth && !currentUser) return null;
        return (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }).filter(Boolean);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-sidebar-primary" />
                <span className="text-xl font-headline text-sidebar-primary group-data-[collapsible=icon]:hidden">Rankle</span>
            </Link>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {renderMenuItems(menuItems)}
                <SidebarSeparator />
                {renderMenuItems(groupItems)}
                <SidebarSeparator />
                {renderMenuItems(socialItems)}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {/* Could add a theme toggle or user profile link here later */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <div className="flex-grow">{children}</div>
            <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
