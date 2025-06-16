
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, PlusCircle, UserPlus } from "lucide-react";

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
            Create or join custom game groups with your friends!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="flex-1 bg-primary hover:bg-primary/90">
              <Link href="/create-group">
                <PlusCircle className="mr-2 h-5 w-5" /> Create a Play Group
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link href="/join-group">
                <UserPlus className="mr-2 h-5 w-5" /> Join a Play Group
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
