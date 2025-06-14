import type { Game } from '@/types';
import { BookOpenText, Puzzle, Calculator, MapPin, Target, Brain, Swords, Dice5, Sparkles, Newspaper } from 'lucide-react';

export const GAMES_DATA: Game[] = [
  {
    id: 'wordle',
    name: 'Wordle',
    description: 'Guess the hidden 5-letter word in 6 tries.',
    link: 'https://www.nytimes.com/games/wordle/index.html',
    icon: BookOpenText,
    averageScore: 4,
    examplePreviousScores: [3, 4, 5, 4],
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Group words into four categories based on common themes.',
    link: 'https://www.nytimes.com/games/connections',
    icon: Puzzle,
    averageScore: 2, // Assuming fewer mistakes is better, or a score based on completion.
    examplePreviousScores: [1, 0, 2, 1],
  },
  {
    id: 'sudoku',
    name: 'Sudoku Daily',
    description: 'Fill a 9x9 grid so that each column, row, and 3x3 subgrid contains all digits from 1 to 9.',
    link: 'https://sudoku.com/',
    icon: Calculator, // Representing numbers/logic
    averageScore: 600, // Assuming time in seconds, lower is better.
    examplePreviousScores: [550, 620, 580],
  },
  {
    id: 'geoguessr',
    name: 'GeoGuessr Daily',
    description: 'Guess locations around the world based on Street View imagery.',
    link: 'https://www.geoguessr.com/daily-challenges',
    icon: MapPin,
    averageScore: 15000, // Points, higher is better
    examplePreviousScores: [12000, 18000, 16500],
  },
  {
    id: 'set',
    name: 'SET Daily Puzzle',
    description: 'Find sets of three cards where each feature is all same or all different.',
    link: 'https://www.setgame.com/set/daily_puzzle',
    icon: Target, // Finding specific combinations
    averageScore: 120, // Time in seconds, lower is better
    examplePreviousScores: [110, 130, 100],
  },
  {
    id: 'mini-crossword',
    name: 'Mini Crossword',
    description: 'Solve a small crossword puzzle quickly.',
    link: 'https://www.nytimes.com/crosswords/game/mini',
    icon: Brain, // Wordplay and knowledge
    averageScore: 45, // Time in seconds, lower is better
    examplePreviousScores: [40, 50, 35],
  },
  {
    id: '2048',
    name: '2048 Daily',
    description: 'Slide numbered tiles to combine them and reach the 2048 tile.',
    link: 'https://play2048.co/',
    icon: Swords, // Metaphor for battling to get higher scores
    averageScore: 5000, // Score, higher is better
    examplePreviousScores: [4500, 5500, 6000],
  },
  {
    id: 'word-scramble',
    name: 'Daily Word Scramble',
    description: 'Unscramble letters to form as many words as possible.',
    link: 'https://www.merriam-webster.com/games/daily-word-scramble',
    icon: Dice5, // Randomness of letters
    averageScore: 80, // Number of words or points
    examplePreviousScores: [70, 90, 85],
  },
  {
    id: 'spot-the-difference',
    name: 'Spot The Difference',
    description: 'Find differences between two similar images.',
    link: 'https://www.onlinegames.io/games/spot-the-difference/',
    icon: Sparkles, // Visual acuity, finding 'sparkling' differences
    averageScore: 5, // Number of differences or time
    examplePreviousScores: [4, 5, 6],
  },
  {
    id: 'news-quiz',
    name: 'Daily News Quiz',
    description: 'Test your knowledge of current events.',
    link: 'https://www.nytimes.com/interactive/2024/todayspaper/news-quiz.html', // Example link
    icon: Newspaper,
    averageScore: 7, // Score out of 10, for example
    examplePreviousScores: [6, 8, 7],
  },
];
