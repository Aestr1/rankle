
"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
