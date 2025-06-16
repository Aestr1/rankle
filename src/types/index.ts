
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

export interface PlayGroupMember {
  uid: string;
  displayName: string | null;
  // photoURL?: string | null; // Future enhancement
}

export interface PlayGroup {
  id: string;
  name: string;
  creatorId: string;
  creatorName?: string; // Denormalized for easier display
  gameIds: string[];
  selectedGamesDetails?: LibraryGame[]; // To store details of selected games if fetched
  joinCode: string; // This might be sensitive, consider how it's used/fetched
  members: PlayGroupMember[];
  createdAt: any; // Firestore timestamp or Date
}
