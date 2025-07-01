import { Baby, GraduationCap, Lightbulb, BrainCircuit, Brain, Crown, Medal, Trophy, type LucideIcon } from 'lucide-react';

export interface Rank {
  name: string;
  threshold: number;
  icon: LucideIcon;
}

export const RANKS_DATA: Rank[] = [
  { name: 'Newbie', threshold: 0, icon: Baby },
  { name: 'Puzzle Apprentice', threshold: 1000, icon: GraduationCap },
  { name: 'Riddle Solver', threshold: 2500, icon: Lightbulb },
  { name: 'Logic Luminary', threshold: 5000, icon: BrainCircuit },
  { name: 'Brainiac', threshold: 10000, icon: Brain },
  { name: 'Puzzle Master', threshold: 20000, icon: Crown },
  { name: 'Grandmaster', threshold: 50000, icon: Medal },
  { name: 'Rankle Legend', threshold: 100000, icon: Trophy },
];

export interface RankInfo {
  currentRank: Rank;
  nextRank: Rank | null;
  progress: number; // percentage (0-100) to next rank
  isMaxRank: boolean;
}

export function getRankForScore(score: number): RankInfo {
  let currentRank = RANKS_DATA[0];
  let nextRank: Rank | null = null;
  
  // Find the current rank by iterating backwards
  for (let i = RANKS_DATA.length - 1; i >= 0; i--) {
    if (score >= RANKS_DATA[i].threshold) {
      currentRank = RANKS_DATA[i];
      if (i < RANKS_DATA.length - 1) {
        nextRank = RANKS_DATA[i + 1];
      }
      break;
    }
  }

  const isMaxRank = nextRank === null;
  let progress = 0;

  if (!isMaxRank && nextRank) {
    const scoreInCurrentTier = score - currentRank.threshold;
    const tierTotalPoints = nextRank.threshold - currentRank.threshold;
    progress = Math.round((scoreInCurrentTier / tierTotalPoints) * 100);
  }

  return {
    currentRank,
    nextRank,
    progress: isMaxRank ? 100 : progress,
    isMaxRank,
  };
}
