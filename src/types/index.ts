import type { LucideIcon } from 'lucide-react';

export interface Game {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: LucideIcon;
  averageScore: number;
  examplePreviousScores: number[];
}
