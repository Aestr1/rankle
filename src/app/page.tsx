"use client";

import { GamesSection } from "@/components/sections/games-section";
import { LeaderboardSection } from "@/components/sections/leaderboard-section";
import React from 'react';

export default function Home() {
  return (
      <main className="flex-grow p-4 md:p-8 space-y-12">
        <GamesSection />
        <LeaderboardSection />
      </main>
  );
}
