"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <SidebarTrigger />
      {/* The main title and auth controls are now in the sidebar */}
    </header>
  );
}
