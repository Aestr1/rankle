
"use client";

import { AboutSection } from "@/components/sections/about-section";
import { GamesSection } from "@/components/sections/games-section";
import { LeaderboardSection } from "@/components/sections/leaderboard-section";
import { AnalyticsSection } from "@/components/sections/analytics-section";
import { Trophy } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-headline text-primary">Rankle</h1>
          </div>
          <AuthButton />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-12">
        <AboutSection />
        <GamesSection />
        <LeaderboardSection />
        <AnalyticsSection />
      </main>
      <footer className="text-center p-6 text-muted-foreground border-t">
        {currentYear ? `© ${currentYear} Rankle. Sharpen your mind, one game at a time.` : 'Loading year...'}
      </footer>
    </div>
  );
}
