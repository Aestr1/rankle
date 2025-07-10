
import type { Game } from '@/types';
import { Timer, BookOpenText, Globe, Puzzle, Waves, FileText } from 'lucide-react';

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
    id: 'strands',
    name: 'Strands',
    description: 'Paste your full "Share" text. Score is based on hints used.',
    link: 'https://www.nytimes.com/games/strands',
    icon: Waves,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Strands #89
“On the bright side”
💡🔵🔵🔵🔵
🔵🟡🔵🔵
🔵🔵`
  },
  {
    id: 'mini-crossword',
    name: 'The Mini',
    description: 'Paste your full "Share" text. Score is based on time.',
    link: 'https://www.nytimes.com/crosswords/game/mini',
    icon: FileText,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `I solved the Aug 20, 2024 New York Times Mini Crossword in 0:45!`
  },
];
