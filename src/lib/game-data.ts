
import type { Game } from '@/types';
import { Timer, BookOpenText, Globe, Film, Globe2, Music, Puzzle, MapPin, Zap, LayoutGrid } from 'lucide-react';

export const GAMES_DATA: Game[] = [
  {
    id: 'timeguessr',
    name: 'Timeguessr',
    description: 'Guess the year of historical photos within a range.',
    link: 'https://timeguessr.com/',
    icon: Timer,
    averageScore: 10000,
    examplePreviousScores: [8000, 12000, 11000],
    scoring: 'desc', // higher is better
  },
  {
    id: 'wordle',
    name: 'Wordle',
    description: 'Guess the hidden 5-letter word in 6 tries.',
    link: 'https://www.nytimes.com/games/wordle/index.html',
    icon: BookOpenText,
    averageScore: 4,
    examplePreviousScores: [3, 4, 5, 4],
    scoring: 'asc', // lower is better
  },
  {
    id: 'worldle',
    name: 'Worldle',
    description: 'Guess the country based on its silhouette.',
    link: 'https://worldle.teuteuf.fr/',
    icon: Globe,
    averageScore: 3,
    examplePreviousScores: [2, 3, 4, 1],
    scoring: 'asc', // lower is better
  },
  {
    id: 'emovi',
    name: 'Emovi',
    description: 'Guess the movie from a sequence of emojis.',
    link: 'https://emovi.teuteuf.fr/',
    icon: Film,
    averageScore: 3,
    examplePreviousScores: [2, 4, 3],
    scoring: 'asc', // lower is better
  },
  {
    id: 'globle',
    name: 'Globle',
    description: 'Guess the mystery country of the world by proximity.',
    link: 'https://globle-game.com/',
    icon: Globe2,
    averageScore: 8,
    examplePreviousScores: [7, 10, 9],
    scoring: 'asc', // lower is better
  },
  {
    id: 'bandle',
    name: 'Bandle',
    description: 'Guess the band from a short audio clip.',
    link: 'https://bandle.app/',
    icon: Music,
    averageScore: 3,
    examplePreviousScores: [2, 4, 1],
    scoring: 'asc', // lower is better
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Group words into four categories based on common themes.',
    link: 'https://www.nytimes.com/games/connections',
    icon: Puzzle,
    averageScore: 1,
    examplePreviousScores: [0, 1, 2, 0],
    scoring: 'asc', // lower is better
  },
  {
    id: 'geoguessr',
    name: 'GeoGuessr Daily',
    description: 'Guess locations based on Street View imagery.',
    link: 'https://www.geoguessr.com/daily-challenges',
    icon: MapPin,
    averageScore: 18000,
    examplePreviousScores: [15000, 20000, 17500],
    scoring: 'desc', // higher is better
  },
  {
    id: 'wikispeedrun',
    name: 'Wikipedia Speedrun',
    description: 'Navigate from a start to an end Wikipedia page.',
    link: 'https://www.wikispeedruns.com/',
    icon: Zap,
    averageScore: 120,
    examplePreviousScores: [100, 150, 110],
    scoring: 'asc', // lower is better
  },
];
