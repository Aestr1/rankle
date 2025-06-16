
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AuthButton } from '@/components/auth-button';
import { Trophy, ShieldCheck, Users, BarChart3, Settings2, Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { PlayGroup, PlayGroupMember } from '@/types';
import { GroupCard } from '@/components/group-card'; // We will create this component

// Mock data for now - replace with Firestore fetching logic
const MOCK_GROUPS: PlayGroup[] = [
  {
    id: "group1",
    name: "Weekend Puzzle Masters",
    creatorId: "user123",
    creatorName: "Alice Wonderland",
    gameIds: ["wordle", "connections", "timeguessr"],
    joinCode: "PUZZLEFUN",
    members: [
      { uid: "user123", displayName: "Alice Wonderland" },
      { uid: "user456", displayName: "Bob The Builder" },
      { uid: "user789", displayName: "Charlie Brown" },
    ],
    createdAt: new Date(2023, 10, 15),
  },
  {
    id: "group2",
    name: "GeoGuessr Pros",
    creatorId: "user456",
    creatorName: "Bob The Builder",
    gameIds: ["geoguessr", "worldle", "globle"],
    joinCode: "GEO123",
    members: [
      { uid: "user456", displayName: "Bob The Builder" },
      { uid: "user001", displayName: "Diana Prince" },
    ],
    createdAt: new Date(2023, 11, 1),
  },
  {
    id: "group3",
    name: "Daily Challenge Crew",
    creatorId: "user000", // A generic creator
    creatorName: "The Game Master",
    gameIds: ["bandle", "emovi"],
    joinCode: "DAILYFUN",
    members: [
      { uid: "user123", displayName: "Alice Wonderland" },
      { uid: "user456", displayName: "Bob The Builder" },
      { uid: "user789", displayName: "Charlie Brown" },
      { uid: "user001", displayName: "Diana Prince" },
      { uid: "user002", displayName: "Edward Nygma" },
    ],
    createdAt: new Date(2024, 0, 5),
  },
];

export default function MyGroupsPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [userGroups, setUserGroups] = useState<PlayGroup[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    // Simulate fetching groups for the current user
    // In a real app, filter MOCK_GROUPS or fetch from Firestore
    // where currentUser.uid is in group.members
    if (currentUser) {
      const filteredGroups = MOCK_GROUPS.filter(group => 
        group.members.some(member => member.uid === currentUser.uid) || group.creatorId === currentUser.uid
      );
      // For testing, if no groups match, show all mock groups if a user is logged in
      setUserGroups(filteredGroups.length > 0 ? filteredGroups : MOCK_GROUPS);
    } else {
      // For demonstration if not logged in, show all groups.
      // In a real app, this page would likely require auth.
      setUserGroups(MOCK_GROUPS); 
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Trophy className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-headline text-primary">Rankle</h1>
          </Link>
          <AuthButton />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <ShieldCheck className="mr-3 h-8 w-8 text-accent" />
              My Play Groups
            </CardTitle>
            <CardDescription>
              View and manage the play groups you've joined or created. Click on a group to see its games and leaderboard.
            </CardDescription>
          </CardHeader>
        </Card>

        {userGroups.length === 0 && !currentUser && (
           <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <Info className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Please sign in to see your groups.</p>
               <Button asChild className="mt-4">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {userGroups.length === 0 && currentUser && (
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <Info className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">You haven't joined or created any groups yet.</p>
              <div className="mt-4 space-x-2">
                <Button asChild>
                  <Link href="/create-group">Create a Group</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/join-group">Join a Group</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {userGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </main>
      <footer className="text-center p-6 text-muted-foreground border-t">
        {currentYear ? `© ${currentYear} Rankle. Sharpen your mind, one game at a time.` : 'Loading year...'}
      </footer>
    </div>
  );
}
