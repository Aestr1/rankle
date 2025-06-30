
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users2, PlusCircle, UserPlus, Globe } from "lucide-react";

export function PlayGroupsSection() {
  return (
    <section id="play-groups" aria-labelledby="play-groups-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <Users2 className="mr-3 h-8 w-8 text-accent" />
            <span id="play-groups-title">Play Groups</span>
          </CardTitle>
           <CardDescription>
            Create or join a private group to compete with friends, or browse public groups to find a new challenge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Link href="/public-groups">
                  <Globe className="mr-2 h-5 w-5" /> Browse Groups
                </Link>
              </Button>
            </div>
        </CardContent>
      </Card>
    </section>
  );
}
