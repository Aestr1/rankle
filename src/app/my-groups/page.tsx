
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Info, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { PlayGroup } from '@/types';
import { GroupCard } from '@/components/group-card';

// Firebase imports
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export default function MyGroupsPage() {
  const [userGroups, setUserGroups] = useState<PlayGroup[]>([]);
  const { currentUser, loading: authLoading } = useAuth();
  const [groupsLoading, setGroupsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return; 
    }
    
    if (!currentUser) {
      setUserGroups([]);
      setGroupsLoading(false);
      return;
    }

    setGroupsLoading(true);
    const groupsQuery = query(collection(db, 'groups'), where('memberUids', 'array-contains', currentUser.uid));

    const unsubscribe = onSnapshot(groupsQuery, (querySnapshot) => {
      const groups: PlayGroup[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        groups.push({ id: doc.id, ...doc.data() } as PlayGroup);
      });
      setUserGroups(groups);
      setGroupsLoading(false);
    }, (error) => {
      console.error("Error fetching groups: ", error);
      setGroupsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, authLoading]);

  return (
    <main className="container flex-grow p-4 md:p-8">
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

        {authLoading || groupsLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : !currentUser ? (
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <Info className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Please sign in to see your groups.</p>
            </CardContent>
          </Card>
        ) : userGroups.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </main>
  );
}
