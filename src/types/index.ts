import type { LucideIcon } from 'lucide-react';

export type GameCategory = 'Word & Letters' | 'Geography & Maps' | 'Logic & Puzzle' | 'Trivia & Knowledge' | 'Media & Pop Culture' | 'Creative & Other';

export interface Game {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: LucideIcon;
  averageScore?: number;
  examplePreviousScores?: number[];
  scoreInputType: 'number' | 'text';
  exampleShareText?: string;
  isFeatured?: boolean;
}

export interface LibraryGame {
  id:string;
  name: string;
  link: string;
  rating: number; // Rating out of 10 for weighted selection
  category: GameCategory;
}

export interface PlayGroupMember {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface PlayGroup {
  id: string;
  name: string;
  creatorId: string;
  creatorName?: string; // Denormalized for easier display
  gameIds: string[];
  memberUids: string[]; // For efficient querying of user's groups
  selectedGamesDetails?: Game[]; // To store details of selected games if fetched
  joinCode: string; // This might be sensitive, consider how it's used/fetched
  members: PlayGroupMember[];
  createdAt: any; // Firestore timestamp or Date
  isPublic: boolean;
  memberCount: number;
}

export interface Gameplay {
    id?: string;
    userId: string;
    userDisplayName: string;
    userPhotoURL: string | null;
    gameId: string;
    groupId: string | null;
    score: number;
    playedAt: any; // Firestore timestamp
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: any; 
  friendUids?: string[]; // Array of user UIDs
  totalScore?: number;
}
