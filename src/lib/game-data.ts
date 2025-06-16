
import type { Game, LibraryGame } from '@/types';
import { Timer, BookOpenText, Globe, Film, Globe2, Music, Puzzle, MapPin, Zap, LayoutGrid } from 'lucide-react';

export const GAMES_DATA: Game[] = [
  {
    id: 'timeguessr',
    name: 'Timeguessr',
    description: 'Guess the year of historical photos within a range.',
    link: 'https://timeguessr.com/',
    icon: Timer,
    averageScore: 10000, // points, higher is better
    examplePreviousScores: [8000, 12000, 11000],
  },
  {
    id: 'wordle',
    name: 'Wordle',
    description: 'Guess the hidden 5-letter word in 6 tries.',
    link: 'https://www.nytimes.com/games/wordle/index.html',
    icon: BookOpenText,
    averageScore: 4, // tries, lower is better
    examplePreviousScores: [3, 4, 5, 4],
  },
  {
    id: 'worldle',
    name: 'Worldle',
    description: 'Guess the country based on its silhouette.',
    link: 'https://worldle.teuteuf.fr/',
    icon: Globe,
    averageScore: 3, // tries, lower is better
    examplePreviousScores: [2, 3, 4, 1],
  },
  {
    id: 'emovi',
    name: 'Emovi',
    description: 'Guess the movie from a sequence of emojis.',
    link: 'https://emovi.teuteuf.fr/',
    icon: Film,
    averageScore: 3, // tries, lower is better
    examplePreviousScores: [2, 4, 3],
  },
  {
    id: 'globle',
    name: 'Globle',
    description: 'Guess the mystery country of the world by proximity.',
    link: 'https://globle-game.com/',
    icon: Globe2,
    averageScore: 8, // tries, lower is better
    examplePreviousScores: [7, 10, 9],
  },
  {
    id: 'bandle',
    name: 'Bandle',
    description: 'Guess the band from a short audio clip.',
    link: 'https://bandle.app/',
    icon: Music,
    averageScore: 3, // tries, lower is better
    examplePreviousScores: [2, 4, 1],
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Group words into four categories based on common themes.',
    link: 'https://www.nytimes.com/games/connections',
    icon: Puzzle,
    averageScore: 1, // mistakes, lower is better
    examplePreviousScores: [0, 1, 2, 0],
  },
  {
    id: 'geoguessr',
    name: 'GeoGuessr Daily',
    description: 'Guess locations based on Street View imagery.',
    link: 'https://www.geoguessr.com/daily-challenges',
    icon: MapPin,
    averageScore: 18000, // points, higher is better
    examplePreviousScores: [15000, 20000, 17500],
  },
  {
    id: 'wikispeedrun',
    name: 'Wikipedia Speedrun',
    description: 'Navigate from a start to an end Wikipedia page.',
    link: 'https://www.wikispeedruns.com/',
    icon: Zap,
    averageScore: 120, // seconds, lower is better
    examplePreviousScores: [100, 150, 110],
  },
];

export const LIBRARY_GAMES_DATA: LibraryGame[] = [
  { id: 'lib-game-1', name: 'Placeholder Game 1' },
  { id: 'lib-game-2', name: 'Placeholder Game 2' },
  { id: 'lib-game-3', name: 'Placeholder Game 3' },
  { id: 'lib-game-4', name: 'Placeholder Game 4' },
  { id: 'lib-game-5', name: 'Placeholder Game 5' },
  { id: 'lib-game-6', name: 'Placeholder Game 6' },
  { id: 'lib-game-7', name: 'Placeholder Game 7' },
  { id: 'lib-game-8', name: 'Placeholder Game 8' },
  { id: 'lib-game-9', name: 'Placeholder Game 9' },
  { id: 'lib-game-10', name: 'Placeholder Game 10' },
  { id: 'lib-game-11', name: 'Placeholder Game 11' },
  { id: 'lib-game-12', name: 'Placeholder Game 12' },
  { id: 'lib-game-13', name: 'Placeholder Game 13' },
  { id: 'lib-game-14', name: 'Placeholder Game 14' },
  { id: 'lib-game-15', name: 'Placeholder Game 15' },
  { id: 'lib-game-16', name: 'Placeholder Game 16' },
  { id: 'lib-game-17', name: 'Placeholder Game 17' },
  { id: 'lib-game-18', name: 'Placeholder Game 18' },
  { id: 'lib-game-19', name: 'Placeholder Game 19' },
  { id: 'lib-game-20', name: 'Placeholder Game 20' },
];
