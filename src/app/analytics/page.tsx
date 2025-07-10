
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { getUserGameplays } from '@/lib/gameplay';
import { GAMES_DATA } from '@/lib/game-data';
import type { Gameplay, Game } from '@/types';
import { Loader2, BarChart2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserGameChart } from '@/components/user-game-chart';
import { Button } from '@/components/ui/button';

interface GameDataMap {
    [gameId: string]: {
        game: Game;
        gameplays: Gameplay[];
    }
}

export default function AnalyticsPage() {
    const { currentUser, loading: authLoading } = useAuth();
    const [gameData, setGameData] = useState<GameDataMap>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const fetchGameplays = async () => {
            setLoading(true);
            try {
                const allGameplays = await getUserGameplays(currentUser.uid);
                const gameMap = new Map(GAMES_DATA.map(g => [g.id, g]));

                const data: GameDataMap = {};
                
                allGameplays.forEach(gp => {
                    const gameDetails = gameMap.get(gp.gameId);
                    if (gameDetails) {
                        if (!data[gp.gameId]) {
                            data[gp.gameId] = {
                                game: gameDetails,
                                gameplays: [],
                            };
                        }
                        data[gp.gameId].gameplays.push(gp);
                    }
                });

                setGameData(data);
            } catch (error) {
                console.error("Failed to fetch user gameplays:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameplays();
    }, [currentUser, authLoading]);

    const content = () => {
        if (authLoading || loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="mt-4 text-muted-foreground">Loading your analytics...</p>
                </div>
            );
        }

        if (!currentUser) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <Info className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-2xl font-semibold">Sign in to View Analytics</h3>
                    <p className="text-muted-foreground mt-2">Your personal game statistics are waiting for you.</p>
                </div>
            );
        }
        
        const playedGames = Object.values(gameData);

        if (playedGames.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <Info className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-2xl font-semibold">No Data Yet</h3>
                    <p className="text-muted-foreground mt-2">Play some games to start tracking your progress!</p>
                     <Button asChild className="mt-4">
                        <Link href="/">Play Games</Link>
                    </Button>
                </div>
            );
        }
        
        return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {playedGames.map(({ game, gameplays }) => (
                    <Card key={game.id} className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl font-headline text-accent">
                                <game.icon className="mr-3 h-7 w-7" />
                                {game.name}
                            </CardTitle>
                             <CardDescription>Your performance over time.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <UserGameChart game={game} gameplays={gameplays} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <main className="container flex-grow p-4 md:p-8 space-y-8">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center text-3xl font-headline text-primary">
                        <BarChart2 className="mr-3 h-8 w-8 text-accent" />
                        My Analytics
                    </CardTitle>
                    <CardDescription>
                        See how you've been performing. Scores are plotted over time.
                    </CardDescription>
                </CardHeader>
            </Card>
            {content()}
        </main>
    );
}
