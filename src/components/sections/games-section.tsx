
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
  return `dailyDuelCompletedGames_${today}`;
};

export function GamesSection() {
  const [completedGames, setCompletedGames] = useState<CompletedGameInfo[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const key = getTodaysStorageKey();
    try {
      const storedCompleted = localStorage.getItem(key);
      if (storedCompleted) {
        setCompletedGames(JSON.parse(storedCompleted));
      } else {
        // Clear old keys if any for hygiene
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('dailyDuelCompletedGames_') && k !== key) {
            localStorage.removeItem(k);
          }
        });
        setCompletedGames([]);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Fallback or error handling if localStorage is not available/accessible
      setCompletedGames([]);
    }
  }, []);

  const handleGameComplete = useCallback((gameId: string, score: number) => {
    const key = getTodaysStorageKey();
    setCompletedGames(prev => {
      // Avoid duplicates, update if already completed (though UI might prevent this)
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
              Play today's featured games. Your scores here are just for you, saved on this device.
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
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
