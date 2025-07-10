
import type { Game } from '@/types';
import { Timer, BookOpenText, Globe, Puzzle, Waves, FileText, Film } from 'lucide-react';

export const GAMES_DATA: Game[] = [
  {
    id: 'timeguessr',
    name: 'Timeguessr',
    description: 'Paste your full "Share" text with the score grid.',
    link: 'https://timeguessr.com/',
    icon: Timer,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
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
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Wordle 1,468 4/6

⬛⬛⬛🟨🟨
⬛⬛🟨⬛⬛
⬛⬛⬛⬛⬛
🟩🟩🟩🟩🟩`
  },
  {
    id: 'worldle',
    name: 'Worldle',
    description: 'Paste your full "Share" text. The app will find your score (e.g., 4/6) automatically.',
    link: 'https://worldle.teuteuf.fr/',
    icon: Globe,
    scoreInputType: 'text',
    scoringStatus: 'unimplemented',
    exampleShareText: `#Worldle #1255 3/6 (100%)
🟩🟩🟩⬛⬛➡️
🟩🟩🟩🟩🟨↘️
🟩🟩🟩🟩🟩🎉
https://worldle.teuteuf.fr`
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Paste your full "Share" text with the emoji grid.',
    link: 'https://www.nytimes.com/games/connections',
    icon: Puzzle,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Connections Puzzle #746
🟨🟨🟨🟨
🟪🟪🟪🟪
🟩🟩🟦🟩
🟩🟩🟩🟩
🟦🟦🟦🟦`
  },
  {
    id: 'emovi',
    name: 'Emovi',
    description: 'Paste your full "Share" text to score based on the guess.',
    link: 'https://emovi.teuteuf.fr/',
    icon: Film,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Emovi 🎬 #1076
🟥🟥🟩
https://emovi.teuteuf.fr`
  },
];
