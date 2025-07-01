"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/components/auth-button";
import { Trophy } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline text-primary hidden md:block">Rankle</h1>
        </Link>
      </div>
      <div className="ml-auto">
        <AuthButton />
      </div>
    </header>
  );
}
