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
import { LogIn, LogOut, User as UserIcon, Loader2, Layers, BarChart3, Users, Library } from "lucide-react";

export function AuthButton() {
  const { currentUser, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" size="icon" disabled className="rounded-full">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (currentUser) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/my-groups">
              <Layers className="mr-2 h-4 w-4" />
              My Groups
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/games-library">
              <Library className="mr-2 h-4 w-4" />
              Games Library
            </Link>
          </Button>
        </div>
        <DropdownMenu>
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
            <DropdownMenuItem asChild className="md:hidden">
                <Link href="/my-groups">
                    <Layers className="mr-2 h-4 w-4" />
                    My Groups
                </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild className="md:hidden">
              <Link href="/games-library">
                <Library className="mr-2 h-4 w-4" />
                Games Library
              </Link>
            </DropdownMenuItem>
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

  return (
    <div className="flex items-center gap-2">
        <Button asChild variant="secondary">
            <Link href="/games-library">
                <Library className="mr-2 h-4 w-4" />
                Games Library
            </Link>
        </Button>
        <Button onClick={signInWithGoogle} variant="outline">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </Button>
    </div>
  );
}
