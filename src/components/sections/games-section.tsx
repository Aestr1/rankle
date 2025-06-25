
"use client";

import { GAMES_DATA } from "@/lib/game-data";
import { GameCard } from "@/components/game-card";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface CompletedGameInfo {
  id: string;
  score: number;
}

const getTodaysStorageKey = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `global_completedGames_${today}`;
};

export function GamesSection() {
  // This state now tracks completion for the session, not for data persistence.
  // The database is the source of truth, but this gives instant UI feedback.
  const [completedGames, setCompletedGames] = useState<CompletedGameInfo[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // You could still use localStorage to remember which games the user *played*
    // during this session on this device, to keep the UI checked.
    const key = getTodaysStorageKey();
    try {
      const storedCompleted = localStorage.getItem(key);
      if (storedCompleted) {
        setCompletedGames(JSON.parse(storedCompleted));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setCompletedGames([]);
    }
  }, []);

  const handleGameComplete = useCallback((gameId: string, score: number) => {
    // This now just updates the UI for the current session.
    const key = getTodaysStorageKey();
    setCompletedGames(prev => {
      const newCompletedGames = [...prev, { id: gameId, score }];
      try {
        localStorage.setItem(key, JSON.stringify(newCompletedGames));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      return newCompletedGames;
    });
  }, []);

  if (!isClient) {
    // Render a loading state or nothing SSR to avoid hydration mismatch with localStorage
    return (
      <section id="games" aria-labelledby="games-title">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <Globe className="mr-3 h-8 w-8 text-accent" />
              <span id="games-title">Global Daily Challenge</span>
            </CardTitle>
             <CardDescription>
              Play today's featured games. Your scores here are just for you, saved on this device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAMES_DATA.map((game) => (
                <div key={game.id} className="h-96 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
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
              Play today's featured games. Scores submitted here are added to your personal analytics but not to a public leaderboard.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {GAMES_DATA.map((game) => {
              const completedInfo = completedGames.find(cg => cg.id === game.id);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  isCompleted={!!completedInfo}
                  submittedScore={completedInfo?.score}
                  onComplete={handleGameComplete}
                  groupId={null} // This signifies a global game
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
