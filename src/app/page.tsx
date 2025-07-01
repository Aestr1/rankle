
"use client";

import React, { useState, useEffect } from 'react';
import { GamesSection } from "@/components/sections/games-section";
import { LeaderboardSection } from "@/components/sections/leaderboard-section";
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export default function Home() {
  const { currentUser, loading } = useAuth();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    if (loading) return; // Wait for auth state to resolve

    if (!currentUser) {
      try {
        const hasSeenModal = sessionStorage.getItem('hasSeenAboutModal');
        if (!hasSeenModal) {
          setIsAboutModalOpen(true);
        }
      } catch (e) {
        console.warn('Could not access sessionStorage:', e);
        // If sessionStorage is not available, we just don't show the modal.
      }
    }
  }, [currentUser, loading]);

  const onModalOpenChange = (open: boolean) => {
    setIsAboutModalOpen(open);
    if (!open) {
      try {
        sessionStorage.setItem('hasSeenAboutModal', 'true');
      } catch (e) {
        console.warn('Could not access sessionStorage:', e);
      }
    }
  };

  return (
      <main className="flex-grow p-4 md:p-8 space-y-12">
        <Dialog open={isAboutModalOpen} onOpenChange={onModalOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-2xl font-headline text-primary">
                        <Info className="mr-3 h-7 w-7 text-accent" />
                        Welcome to Rankle!
                    </DialogTitle>
                     <DialogDescription className="text-left pt-2">
                        This is your personal hub to track your scores and compete with friends on popular daily puzzle games.
                     </DialogDescription>
                </DialogHeader>
                 <div className="space-y-3 text-sm text-foreground">
                    <p>
                        <strong>How it works:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Click a "Play Game" button to open a daily puzzle game on its official website.</li>
                        <li>After you finish the game, look for a "Share" button to copy your results to the clipboard.</li>
                        <li>Return to Rankle and use the "Paste" button on the game card to enter your score automatically.</li>
                        <li>Click "Submit Score" to save your progress to your personal analytics and the leaderboards.</li>
                    </ul>
                    <p>
                        Sign in to save your scores, create groups, and compete with friends!
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onModalOpenChange(false)}>Got it!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <GamesSection />
        <LeaderboardSection />
      </main>
  );
}
