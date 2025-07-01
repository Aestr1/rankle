
import type { Game } from '@/types';
import { Timer, BookOpenText, Globe, Film, Puzzle } from 'lucide-react';

export const GAMES_DATA: Game[] = [
  {
    id: 'timeguessr',
    name: 'Timeguessr',
    description: 'Paste your full "Share" text with the score grid.',
    link: 'https://timeguessr.com/',
    icon: Timer,
    examplePreviousScores: [15000, 22000, 19000],
    scoreInputType: 'text',
    exampleShareText: `TimeGuessr #759 39,838/50,000
🌎🟩🟩🟨 📅🟩🟩🟨
🌎🟩🟩🟨 📅🟩⬛⬛
🌎🟩⬛️⬛️ 📅🟩⬛⬛
🌎🟩🟩🟨 📅🟩⬛⬛
🌎🟩🟩🟨 📅🟩🟩🟨
https://timeguessr.com`
  },
  {
    id: 'wordle',
    name: 'Wordle',
    description: 'Paste your full "Share" text with the emoji grid.',
    link: 'https://www.nytimes.com/games/wordle/index.html',
    icon: BookOpenText,
    examplePreviousScores: [3, 4, 5, 4],
    scoreInputType: 'text',
    exampleShareText: `Wordle 1,471 4/6

⬜⬜⬜⬜⬜
🟨⬜🟨⬜⬜
⬜🟩⬜🟩🟩
🟩🟩🟩🟩🟩`
  },
  {
    id: 'worldle',
    name: 'Worldle',
    description: 'Paste your full "Share" text. The app will find your score (e.g., 4/6) automatically.',
    link: 'https://worldle.teuteuf.fr/',
    icon: Globe,
    examplePreviousScores: [2, 3, 4, 1],
    scoreInputType: 'text',
    exampleShareText: `#Worldle #1255 3/6 (100%)
🟩🟩🟩⬛⬛➡️
🟩🟩🟩🟩🟨↘️
🟩🟩🟩🟩🟩🎉
https://worldle.teuteuf.fr`
  },
  {
    id: 'emovi',
    name: 'Emovi',
    description: 'Paste your full "Share" text with the emoji grid.',
    link: 'https://emovi.teuteuf.fr/',
    icon: Film,
    examplePreviousScores: [2, 4, 3],
    scoreInputType: 'text',
    exampleShareText: `#Emovi 🎬 #1079
🧹🏫👨‍🏫🧠🍎
🟩⬜⬜
https://emovi.teuteuf.fr`
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Paste your full "Share" text with the emoji grid.',
    link: 'https://www.nytimes.com/games/connections',
    icon: Puzzle,
    examplePreviousScores: [0, 1, 2, 0],
    scoreInputType: 'text',
    exampleShareText: `Connections
Puzzle #749
🟩🟩🟩🟩
🟪🟪🟪🟪
🟦🟦🟦🟦
🟨🟨🟨🟨`
  },
];
