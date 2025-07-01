
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, ExternalLink } from 'lucide-react';
import { LIBRARY_GAMES_DATA } from '@/lib/library-game-data';

export default function GamesLibraryPage() {
  return (
    <main className="flex-grow p-4 md:p-8">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Name</TableHead>
                    <TableHead className="text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LIBRARY_GAMES_DATA.map((game) => (
                    <TableRow key={game.name}>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <a href={game.link} target="_blank" rel="noopener noreferrer">
                            Play Game <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
  );
}
