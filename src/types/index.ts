
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

export interface LibraryGame {
  id: string;
  name: string;
}

export interface PlayGroup {
  id: string;
  name: string;
  creatorId: string;
  gameIds: string[]; // Array of LibraryGame IDs
  joinCode: string;
  createdAt: any; // Firestore timestamp
}
