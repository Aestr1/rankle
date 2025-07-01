
"use client";

import { GAMES_DATA } from "@/lib/game-data";
import { GameCard } from "@/components/game-card";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getUserGameplaysForDate } from "@/lib/gameplay";
import type { Gameplay, Game } from "@/types";
import { getGameOfTheDay } from "@/lib/game-of-the-day";

export function GamesSection() {
  const { currentUser, loading: authLoading } = useAuth();
  const [todaysGameplays, setTodaysGameplays] = useState<Gameplay[]>([]);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [gameOfTheDay, setGameOfTheDay] = useState<Game | null>(null);

  useEffect(() => {
    // This runs only on the client, after hydration, preventing a mismatch.
    setGameOfTheDay(getGameOfTheDay());
  }, []);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth state to resolve
    }

    const fetchTodaysScores = async () => {
      if (!currentUser) {
        setTodaysGameplays([]);
        setScoresLoading(false);
        return;
      }
      setScoresLoading(true);
      try {
        // Use a client-side new Date() to be consistent
        const gameplays = await getUserGameplaysForDate(currentUser.uid, new Date());
        setTodaysGameplays(gameplays);
      } catch (error) {
        console.error("Failed to fetch today's gameplays:", error);
        setTodaysGameplays([]);
      } finally {
        setScoresLoading(false);
      }
    };

    fetchTodaysScores();
  }, [currentUser, authLoading]);

  const handleGameComplete = useCallback((gameId: string, score: number) => {
    // This provides instant UI feedback without waiting for a re-fetch.
    // The database is the true source of truth, but this makes the app feel faster.
    const newGameplay = {
      gameId,
      score,
      userId: currentUser?.uid || '',
      userDisplayName: currentUser?.displayName || '',
      playedAt: new Date(),
      groupId: null
    };
    setTodaysGameplays(prev => [...prev, newGameplay as Gameplay]);
  }, [currentUser]);


  const renderGameCards = () => {
     // Show skeletons if we're waiting for auth or haven't set the game of the day yet.
     if (authLoading || scoresLoading || !gameOfTheDay) {
        const skeletonCount = GAMES_DATA.length + 1; // +1 for game of day
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(skeletonCount)].map((_, i) => (
                <div key={`skeleton-${i}`} className="h-96 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
        )
     }

     const allGamesForToday = [gameOfTheDay, ...GAMES_DATA];

     return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {allGamesForToday.map((game: Game) => {
              // Find the best score for the current game to handle multiple submissions
              const playsForThisGame = todaysGameplays.filter(gp => gp.gameId === game.id);
              const bestPlay = playsForThisGame.length > 0
                ? playsForThisGame.reduce((best, current) => current.score > best.score ? current : best)
                : null;
              
              return (
                 <GameCard
                    key={game.id}
                    game={game}
                    isCompleted={!!bestPlay}
                    submittedScore={bestPlay?.score}
                    onComplete={handleGameComplete}
                    groupId={null} // This signifies a global game
                  />
              );
            })}
          </div>
     )
  }

  return (
    <section id="games" aria-labelledby="games-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <Globe className="mr-3 h-8 w-8 text-accent" />
            <span id="games-title">Global Daily Challenge</span>
          </CardTitle>
           <CardDescription>
              Play today's featured games. Your scores contribute to your personal analytics and the global leaderboard.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {renderGameCards()}
        </CardContent>
      </Card>
    </section>
  );
}
