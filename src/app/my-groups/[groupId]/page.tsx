
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthButton } from '@/components/auth-button';
import { Trophy, ArrowLeft, Gamepad2, Users, BarChart3, Info, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { PlayGroup, Game } from '@/types';
import { GAMES_DATA } from '@/lib/game-data';
import { GameCard } from '@/components/game-card';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from "firebase/firestore";

interface GroupCompletedGameInfo {
  id: string; // game id
  score: number;
}

export default function IndividualGroupPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [group, setGroup] = useState<PlayGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const params = useParams();
  const groupId = params.groupId as string;

  const [completedGroupGames, setCompletedGroupGames] = useState<GroupCompletedGameInfo[]>([]);
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!groupId) return;

    setIsLoading(true);
    const groupDocRef = doc(db, "groups", groupId);

    const unsubscribe = onSnapshot(groupDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const groupData = docSnap.data() as Omit<PlayGroup, 'id'>;
        const gamesForGroup = GAMES_DATA.filter(gameData => groupData.gameIds.includes(gameData.id));
        setGroup({ 
            id: docSnap.id, 
            ...groupData, 
            selectedGamesDetails: gamesForGroup 
        });

        // Load completion status for this specific group from localStorage
        const key = getGroupStorageKey(groupId);
        try {
            const storedCompleted = localStorage.getItem(key);
            setCompletedGroupGames(storedCompleted ? JSON.parse(storedCompleted) : []);
        } catch (error) {
            console.error("Error accessing localStorage for group games:", error);
            setCompletedGroupGames([]);
        }
      } else {
        setGroup(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching group details:", error);
        setGroup(null);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  const getGroupStorageKey = (currentGroupId: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `group_${currentGroupId}_completedGames_${today}`;
  };

  const handleGroupGameComplete = (gameId: string, score: number) => {
    if (!group) return;
    const key = getGroupStorageKey(group.id);
    setCompletedGroupGames(prev => {
      const existing = prev.find(g => g.id === gameId);
      let newCompletedGames;
      if (existing) {
        newCompletedGames = prev.map(g => g.id === gameId ? { id: gameId, score } : g);
      } else {
        newCompletedGames = [...prev, { id: gameId, score }];
      }
      try {
        localStorage.setItem(key, JSON.stringify(newCompletedGames));
      } catch (error) {
        console.error("Error saving group game to localStorage:", error);
      }
      return newCompletedGames;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-xl text-muted-foreground">Loading group details...</p>
      </div>
    );
  }

  if (!group) {
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
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          <Card className="w-full max-w-lg text-center shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-3xl font-headline text-destructive">
                <Info className="mr-3 h-8 w-8" />
                Group Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                The group you are looking for does not exist or could not be loaded.
              </p>
              <Button asChild variant="outline">
                <Link href="/my-groups">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to My Groups
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
         <footer className="text-center p-6 text-muted-foreground border-t">
            {currentYear ? `© ${currentYear} Rankle. Sharpen your mind, one game at a time.` : 'Loading year...'}
        </footer>
      </div>
    );
  }

  const gamesToDisplay = group.selectedGamesDetails || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
             <Button variant="ghost" size="icon" asChild className="mr-2">
                <Link href="/my-groups" aria-label="Back to My Groups">
                    <ArrowLeft className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <Trophy className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-headline text-primary truncate max-w-xs md:max-w-md lg:max-w-lg" title={group.name}>{group.name}</h1>
          </div>
          <AuthButton />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline text-accent">
              <Gamepad2 className="mr-3 h-7 w-7" />
              Today's Games
            </CardTitle>
            <CardDescription>Play the selected games for the "{group.name}" group.</CardDescription>
          </CardHeader>
          <CardContent>
            {gamesToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gamesToDisplay.map((game: Game) => {
                    const completedInfo = completedGroupGames.find(cg => cg.id === game.id);
                    return (
                        <GameCard
                        key={game.id}
                        game={game}
                        isCompleted={!!completedInfo}
                        submittedScore={completedInfo?.score}
                        onComplete={handleGroupGameComplete}
                        />
                    );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No games have been selected for this group yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-headline text-accent">
                  <Users className="mr-3 h-7 w-7" />
                  Members ({group.members.length})
                </CardTitle>
                 <CardDescription>Join Code: <span className="font-mono bg-muted/80 px-1.5 py-0.5 rounded text-foreground/80 ml-1">{group.joinCode}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {group.members.map(member => (
                    <li key={member.uid} className="flex items-center">
                      <span className="inline-block h-2 w-2 bg-primary rounded-full mr-2"></span>
                      {member.displayName || member.uid}
                      {member.uid === group.creatorId && <span className="ml-2 text-xs font-semibold text-accent">(Creator)</span>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-headline text-accent">
                  <BarChart3 className="mr-3 h-7 w-7" />
                  Group Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center min-h-[150px] text-center text-muted-foreground p-6 rounded-lg border-2 border-dashed">
                  <BarChart3 className="h-12 w-12 mb-3 text-primary opacity-50" />
                  <h3 className="text-lg font-semibold mb-1">Group Leaderboard Coming Soon!</h3>
                  <p className="text-sm">Track scores and rankings specific to this group.</p>
                </div>
              </CardContent>
            </Card>
        </div>

      </main>
      <footer className="text-center p-6 text-muted-foreground border-t">
        {currentYear ? `© ${currentYear} Rankle. Sharpen your mind, one game at a time.` : 'Loading year...'}
      </footer>
    </div>
  );
}
