"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Trophy, Info } from 'lucide-react';
import { getGroupGameplays } from '@/lib/gameplay';
import type { Gameplay, PlayGroup } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface GroupLeaderboardProps {
  groupId: string;
}

interface PlayerStats {
  userId: string;
  displayName: string;
  totalScore: number;
  gamesPlayed: number;
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
        // 1. Fetch Group and Game Info
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            setError("Group not found.");
            setLeaderboard([]);
            setIsLoading(false);
            return;
        }

        const groupData = groupSnap.data() as PlayGroup;
        const groupMembers = groupData.members || [];
        
        // 2. Initialize stats for all members to handle the "0 score for unplayed games" rule.
        const playerStatsMap = new Map<string, PlayerStats>();
        groupMembers.forEach(member => {
            playerStatsMap.set(member.uid, {
                userId: member.uid,
                displayName: member.displayName || 'Player',
                totalScore: 0,
                gamesPlayed: 0,
            });
        });

        // 3. Fetch all of today's gameplay records for the group.
        const gameplays = await getGroupGameplays(groupId, new Date());
        
        // 4. Filter for only the BEST score for each user for each game to prevent multiple submissions for the same game from inflating scores.
        const bestScores = new Map<string, Gameplay>(); // Key: 'userId-gameId'
        gameplays.forEach(gp => {
            const key = `${gp.userId}-${gp.gameId}`;
            const existingBest = bestScores.get(key);
            if (!existingBest || gp.score > existingBest.score) {
                bestScores.set(key, gp);
            }
        });

        // 5. Aggregate the best scores into the player stats.
        bestScores.forEach(gp => {
            if (playerStatsMap.has(gp.userId)) {
                const stats = playerStatsMap.get(gp.userId)!;
                stats.totalScore += gp.score;
                stats.gamesPlayed += 1;
            }
        });
        
        // 6. Sort the final leaderboard. Higher total score is better.
        const finalLeaderboard = Array.from(playerStatsMap.values()).sort((a, b) => {
            return b.totalScore - a.totalScore; 
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
        <h3 className="text-lg font-semibold">No Members in Group</h3>
        <p className="text-sm">Add some members to start the competition!</p>
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
                    <TableHead className="w-[20%] text-center">Total Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboard.map((player, index) => (
                    <TableRow key={player.userId}>
                        <TableCell className="text-center font-bold text-lg">
                            {index === 0 && player.totalScore > 0 && <Trophy className="h-5 w-5 text-yellow-500 inline-block mr-1" />}
                            {index === 1 && player.totalScore > 0 && <Trophy className="h-5 w-5 text-slate-400 inline-block mr-1" />}
                            {index === 2 && player.totalScore > 0 && <Trophy className="h-5 w-5 text-amber-600 inline-block mr-1" />}
                            {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{player.displayName}</TableCell>
                        <TableCell className="text-center">{player.gamesPlayed}</TableCell>
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
