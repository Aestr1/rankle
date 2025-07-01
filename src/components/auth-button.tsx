"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User as UserIcon, Loader2, BarChart3, Users } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AuthButton() {
  const { currentUser, loading, signInWithGoogle, signOutUser } = useAuth();
  const { state: sidebarState } = useSidebar();

  if (loading) {
    return (
      <div className="p-2 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className={sidebarState === 'collapsed' ? 'flex justify-center' : ''}>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                    <AvatarFallback>
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" hidden={sidebarState !== 'collapsed'}>
              {currentUser.displayName || "User Profile"}
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/friends">
                <Users className="mr-2 h-4 w-4" />
                Friends
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutUser}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Signed-out state
  if (sidebarState === 'collapsed') {
    return (
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={signInWithGoogle} variant="ghost" size="icon" className="rounded-full">
              <LogIn />
              <span className="sr-only">Sign in</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Sign in
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  return (
    <Button onClick={signInWithGoogle} variant="outline" className="w-full">
      <LogIn className="mr-2 h-4 w-4" />
      Sign in
    </Button>
  );
}
