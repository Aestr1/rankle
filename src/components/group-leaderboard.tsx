
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Trophy, Info } from 'lucide-react';
import { getGroupGameplays } from '@/lib/gameplay';
import type { Gameplay } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface GroupLeaderboardProps {
  groupId: string;
}

interface PlayerStats {
  userId: string;
  displayName: string;
  totalRankPoints: number;
  gamesPlayed: number;
  totalNormalizedScore: number;
}

export function GroupLeaderboard({ groupId }: GroupLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessScores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const gameplays = await getGroupGameplays(groupId, new Date());
        if (gameplays.length === 0) {
          setLeaderboard([]);
          setIsLoading(false);
          return;
        }
        
        // Group scores by game
        const scoresByGame = new Map<string, Gameplay[]>();
        gameplays.forEach(gp => {
          if (!scoresByGame.has(gp.gameId)) {
            scoresByGame.set(gp.gameId, []);
          }
          scoresByGame.get(gp.gameId)!.push(gp);
        });

        // Rank players within each game. Higher score is always better now.
        const ranksByGame = new Map<string, Map<string, number>>(); // gameId -> userId -> rank
        scoresByGame.forEach((scores) => {
          const sortedScores = [...scores].sort((a, b) => b.score - a.score);

          if (sortedScores.length > 0) {
            const gameId = sortedScores[0].gameId;
            const gameRanks = new Map<string, number>();
            let rank = 1;
            sortedScores.forEach((s, i) => {
              // Award same rank for ties
              if (i > 0 && s.score !== sortedScores[i-1].score) {
                rank = i + 1;
              }
              gameRanks.set(s.userId, rank);
            });
            ranksByGame.set(gameId, gameRanks);
          }
        });

        // Aggregate player stats
        const playerStatsMap = new Map<string, PlayerStats>();
        gameplays.forEach(gp => {
          if (!playerStatsMap.has(gp.userId)) {
            playerStatsMap.set(gp.userId, {
              userId: gp.userId,
              displayName: gp.userDisplayName,
              totalRankPoints: 0,
              gamesPlayed: 0,
              totalNormalizedScore: 0,
            });
          }
          const stats = playerStatsMap.get(gp.userId)!;
          stats.totalNormalizedScore += gp.score;
        });

        ranksByGame.forEach((ranks, gameId) => {
            ranks.forEach((rank, userId) => {
                if(playerStatsMap.has(userId)) {
                    const stats = playerStatsMap.get(userId)!;
                    stats.totalRankPoints += rank;
                    stats.gamesPlayed += 1;
                }
            });
        });

        const finalLeaderboard = Array.from(playerStatsMap.values()).sort((a, b) => {
            if (a.totalRankPoints !== b.totalRankPoints) {
                return a.totalRankPoints - b.totalRankPoints; // Lower rank points is better
            }
            // Tie-breaker: higher total normalized score is better
            return b.totalNormalizedScore - a.totalNormalizedScore; 
        });

        setLeaderboard(finalLeaderboard);

      } catch (e) {
        console.error("Error fetching leaderboard data:", e);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessScores();
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[150px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading Leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[150px] text-destructive">
        <Info className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[150px] text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
        <Trophy className="h-10 w-10 mb-2 text-primary opacity-50" />
        <h3 className="text-lg font-semibold">No Scores Yet Today!</h3>
        <p className="text-sm">Be the first to submit a score to get on the board.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[15%] text-center">Rank</TableHead>
                    <TableHead className="w-[45%]">Player</TableHead>
                    <TableHead className="w-[20%] text-center">Games</TableHead>
                    <TableHead className="w-[20%] text-center">Rank Pts</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboard.map((player, index) => (
                    <TableRow key={player.userId}>
                        <TableCell className="text-center font-bold text-lg">
                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 inline-block mr-1" />}
                            {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{player.displayName}</TableCell>
                        <TableCell className="text-center">{player.gamesPlayed}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant="secondary">{player.totalRankPoints}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
