
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { AuthButton } from "./auth-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mainNavItems = [
  { href: "/", label: "Home" },
  { href: "/my-groups", label: "My Groups", auth: true },
  { href: "/public-groups", label: "Browse Groups" },
  { href: "/games-library", label: "Games Library" },
];

const secondaryNavItems = [
    { href: "/analytics", label: "My Stats", auth: true },
    { href: "/friends", label: "Friends", auth: true },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/settings", label: "Settings", auth: true },
]

export function AppHeader() {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const NavLink = ({ href, children, isMobile = false }: { href: string; children: React.ReactNode; isMobile?: boolean }) => {
    const linkClasses = cn(
        "transition-colors hover:text-primary",
        isActive(href) ? "text-primary font-semibold" : "text-muted-foreground",
        isMobile ? "text-lg w-full block p-2" : "text-sm font-medium"
    );

    return (
        <Link href={href} className={linkClasses} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            {children}
        </Link>
    );
  };

  const renderNavLinks = (items: typeof mainNavItems, isMobile = false) => {
    return items.map((item) => {
      if (item.auth && !currentUser) return null;
      return (
        <NavLink key={item.href} href={item.href} isMobile={isMobile}>
          {item.label}
        </NavLink>
      );
    }).filter(Boolean);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="hidden font-bold sm:inline-block text-2xl font-headline">Rankle</span>
          </Link>
          <nav className="flex items-center space-x-6">
            {renderNavLinks(mainNavItems)}
          </nav>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
           <div className="flex md:hidden flex-1 items-center justify-start">
             <Link href="/" className="flex items-center space-x-2">
                <Trophy className="h-7 w-7 text-primary" />
                <span className="font-bold text-xl font-headline">Rankle</span>
            </Link>
           </div>
          <SheetContent side="left" className="pr-0 w-3/4">
             <Link href="/" className="mb-8 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <Trophy className="mr-2 h-7 w-7 text-primary" />
                <span className="font-bold text-xl font-headline">Rankle</span>
            </Link>
            <div className="flex flex-col space-y-3">
                {renderNavLinks(mainNavItems, true)}
            </div>
             <div className="my-4 h-px w-full bg-border" />
            <div className="flex flex-col space-y-3">
                 {renderNavLinks(secondaryNavItems, true)}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
