
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BookOpen, ExternalLink, Trophy } from 'lucide-react';
import { LIBRARY_GAMES_DATA } from '@/lib/library-game-data';
import { AppFooter } from '@/components/app-footer';
import { AuthButton } from '@/components/auth-button';

export default function GamesLibraryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
                <Link href="/" aria-label="Back to Home">
                    <ArrowLeft className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <Trophy className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-headline text-primary">Rankle</h1>
          </div>
          <AuthButton />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
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
      <AppFooter />
    </div>
  );
}
