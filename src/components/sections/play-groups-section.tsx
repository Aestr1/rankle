
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, PlusCircle, UserPlus, Layers } from "lucide-react";

export function PlayGroupsSection() {
  return (
    <section id="play-groups" aria-labelledby="play-groups-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <Users2 className="mr-3 h-8 w-8 text-accent" />
            <span id="play-groups-title">Play Groups</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Create or join custom game groups with your friends, or view your existing groups!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/create-group">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Group
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/join-group">
                <UserPlus className="mr-2 h-5 w-5" /> Join Group
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/my-groups">
                <Layers className="mr-2 h-5 w-5" /> My Groups
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
