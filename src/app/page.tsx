"use client";

import { AboutSection } from "@/components/sections/about-section";
import { GamesSection } from "@/components/sections/games-section";
import { LeaderboardSection } from "@/components/sections/leaderboard-section";
import { AnalyticsSection } from "@/components/sections/analytics-section";
import { PlayGroupsSection } from "@/components/sections/play-groups-section";
import { Trophy } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import React from 'react';
import { AppFooter } from "@/components/app-footer";
import { AdPlaceholder } from "@/components/ad-placeholder";

export default function Home() {
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
        <AdPlaceholder />
        <PlayGroupsSection />
        <LeaderboardSection />
        <AnalyticsSection />
      </main>
      <AppFooter />
    </div>
  );
}
