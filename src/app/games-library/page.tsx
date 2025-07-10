
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, ExternalLink, Search, Shuffle } from 'lucide-react';
import { LIBRARY_GAMES_DATA } from '@/lib/library-game-data';
import type { GameCategory } from '@/types';

export default function GamesLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GameCategory | 'all'>('all');

  const categories: (GameCategory | 'all')[] = ['all', ...Array.from(new Set(LIBRARY_GAMES_DATA.map(g => g.category)))];

  const filteredGames = useMemo(() => {
    return LIBRARY_GAMES_DATA.filter(game => {
      const matchesCategory = categoryFilter === 'all' || game.category === categoryFilter;
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, categoryFilter]);

  const handleRandomGame = () => {
    if (filteredGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredGames.length);
      const randomGame = filteredGames[randomIndex];
      window.open(randomGame.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <main className="container flex-grow p-4 md:p-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <BookOpen className="mr-3 h-8 w-8 text-accent" />
              Games Library
            </CardTitle>
            <CardDescription>
              A comprehensive list of daily puzzle and trivia games for you to explore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by game name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                    />
                </div>
                 <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as GameCategory | 'all')}>
                    <SelectTrigger className="w-full sm:w-[240px]">
                        <SelectValue placeholder="Filter by category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleRandomGame} disabled={filteredGames.length === 0} className="w-full sm:w-auto">
                    <Shuffle className="mr-2 h-4 w-4" />
                    Play a Random Game
                </Button>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{game.name}</TableCell>
                        <TableCell className="text-muted-foreground">{game.category}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <a href={game.link} target="_blank" rel="noopener noreferrer">
                              Play Game <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            No games match your search criteria.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
  );
}
