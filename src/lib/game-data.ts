
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
