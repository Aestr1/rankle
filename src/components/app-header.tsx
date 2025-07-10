
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { AuthButton } from "./auth-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/my-groups", label: "My Groups", auth: true },
  { href: "/public-groups", label: "Browse Groups" },
  { href: "/games-library", label: "Games Library" },
];

const mobileOnlyNavItems = [
    { href: "/analytics", label: "My Stats", auth: true },
    { href: "/friends", label: "Friends", auth: true },
    { href: "/settings", label: "Settings", auth: true },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
]

export function AppHeader() {
  const { currentUser } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode; }) => (
    <Link 
      href={href} 
      className={cn(
        "transition-colors text-sm font-medium hover:text-primary",
        isActive(href) ? "text-primary font-semibold" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode; }) => (
     <SheetClose asChild>
        <Link 
        href={href} 
        className={cn(
            "transition-colors text-lg p-2 block w-full rounded-md",
            isActive(href) ? "bg-muted font-semibold text-primary" : "text-foreground"
        )}
        >
        {children}
        </Link>
    </SheetClose>
  );

  const renderNavLinks = (isMobile = false) => {
    const Component = isMobile ? MobileNavLink : NavLink;
    const items = isMobile ? [...navItems, ...mobileOnlyNavItems] : navItems;
    
    return items.map((item) => {
      if (item.auth && !currentUser) return null;
      return (
        <Component key={item.href} href={item.href}>
          {item.label}
        </Component>
      );
    }).filter(Boolean);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Section (Logo & Nav) */}
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-primary" />
                <span className="hidden font-bold sm:inline-block text-2xl font-headline">Daily Duel</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {renderNavLinks()}
            </nav>
        </div>

        {/* Mobile Menu Trigger (becomes part of the right section for layout) */}
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0 w-3/4">
                    <SheetClose asChild>
                      <Link href="/" className="mb-8 flex items-center px-4">
                          <Trophy className="mr-2 h-7 w-7 text-primary" />
                          <span className="font-bold text-xl font-headline">Daily Duel</span>
                      </Link>
                    </SheetClose>
                    <div className="flex flex-col space-y-2 px-2">
                        {renderNavLinks(true)}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        
        {/* Right Section (Auth Button) */}
        <div className="hidden md:flex items-center justify-end">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
