"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Trophy, Info } from 'lucide-react';
import { getGlobalGameplays } from '@/lib/gameplay';
import type { Gameplay } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { GAMES_DATA } from '@/lib/game-data';

interface PlayerStats {
  userId: string;
  displayName: string;
  totalScore: number;
  gamesPlayed: number;
}

const LEADERBOARD_LIMIT = 20; // Show top 20 players

export function GlobalLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessScores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch all of today's global gameplay records.
        const gameplays = await getGlobalGameplays(new Date());

        // 2. Filter for only the BEST score for each user for each game.
        const bestScores = new Map<string, Gameplay>(); // Key: 'userId-gameId'
        gameplays.forEach(gp => {
            const key = `${gp.userId}-${gp.gameId}`;
            const existingBest = bestScores.get(key);
            if (!existingBest || gp.score > existingBest.score) {
                bestScores.set(key, gp);
            }
        });

        // 3. Aggregate scores by player.
        const playerStatsMap = new Map<string, PlayerStats>();
        bestScores.forEach(gp => {
            if (!playerStatsMap.has(gp.userId)) {
                playerStatsMap.set(gp.userId, {
                    userId: gp.userId,
                    displayName: gp.userDisplayName || 'Anonymous',
                    totalScore: 0,
                    gamesPlayed: 0,
                });
            }
            const stats = playerStatsMap.get(gp.userId)!;
            stats.totalScore += gp.score;
            stats.gamesPlayed += 1;
        });
        
        // 4. Sort the final leaderboard and limit the results.
        const finalLeaderboard = Array.from(playerStatsMap.values())
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, LEADERBOARD_LIMIT);

        setLeaderboard(finalLeaderboard);

      } catch (e) {
        console.error("Error fetching global leaderboard data:", e);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessScores();
  }, []);

  const totalGames = GAMES_DATA.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading Global Leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">
        <Info className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
        <Trophy className="h-16 w-16 mb-4 text-primary opacity-50" />
        <h3 className="text-xl font-semibold">The Leaderboard is Empty</h3>
        <p>Be the first to play today's global challenge games and claim the top spot!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <p className="text-sm text-muted-foreground mb-4">Showing top {leaderboard.length} players for today's global challenge. Scores are the sum of all normalized game scores.</p>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[15%] text-center">Rank</TableHead>
                    <TableHead className="w-[45%]">Player</TableHead>
                    <TableHead className="w-[20%] text-center">Games Played</TableHead>
                    <TableHead className="w-[20%] text-center">Total Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboard.map((player, index) => (
                    <TableRow key={player.userId}>
                        <TableCell className="text-center font-bold text-lg">
                            {index === 0 && player.totalScore > 0 && <Trophy className="h-5 w-5 text-yellow-500 inline-block mr-1" />}
                            {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{player.displayName}</TableCell>
                        <TableCell className="text-center">{player.gamesPlayed} / {totalGames}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant="secondary">{player.totalScore}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
