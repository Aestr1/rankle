
import type { Game } from '@/types';
import { Timer, BookOpenText, Globe, Film, Puzzle, Waves, FileText, Hexagon, Swords, Key, Cat, Percent, Grid, Utensils, Gamepad2, BrainCircuit } from 'lucide-react';

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
  {
    id: 'hexle',
    name: 'Hexle',
    description: 'Paste your share text to score.',
    link: 'https://hexcodle.com/', // Note: Link provided was hexcodle, using that
    icon: Hexagon,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Hexle 178 3/6
🟨🟩🟩🟩⬜🟩
⬜🟩🟩🟩🟩🟩
🟩🟩🟩🟩🟩🟩`
  },
  {
    id: 'victordle',
    name: 'Victordle',
    description: 'Paste your share text to score.',
    link: 'https://www.britannica.com/games/victordle/',
    icon: Swords,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `I beat my opponent in Victordle!

⬛🟨⬛⬛⬛
⬛⬛⬛⬛🟨
⬛⬛⬛⬛🟨
⬛⬛🟨🟨⬛
🟩⬛⬛⬛🟨
🟩🟩⬛⬛🟨
🟩🟩🟩🟩🟩`
  },
  {
    id: 'cyphr',
    name: 'Cyphr',
    description: 'Paste your share text to score.',
    link: 'https://cyphrgame.com/',
    icon: Key,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Cyphr 27/06/2025
Score: 28/28
Guesses remaining: 25
🟩
🟩🟩
🟩🟩🟩
🟩🟩🟩🟩
🟩🟩🟩🟩🟩
🟩🟩🟩🟩🟩🟩
🟩🟩🟩🟩🟩🟩🟩`
  },
  {
    id: 'squirdle',
    name: 'Squirdle',
    description: 'Paste your share text to score.',
    link: 'https://squirdle.fireblend.com/',
    icon: Cat,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Squirdle 9/9
🔼🟥🟩🔽🔽
🔼🟥🟥🔼🔼
🟩🟥🟩🔽🔽
🟩🟥🟥🔽🔼
🟩🟥🟩🔽🔽
🟩🟥🟥🔽🔽
🟩🟥🟩🔽🔼
🟩🟥🟩🔽🔼
🟩🟩🟩🟩🟩`
  },
  {
    id: 'globle',
    name: 'Globle',
    description: 'Paste your full "Share" text.',
    link: 'https://globle-game.com/',
    icon: Globe,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `🌎 Jun 26, 2025 🌍
🔥 1 | Avg. Guesses: 6
⬜🟧⬜🟧🟧🟩 = 6
https://globle-game.com`
  },
  {
    id: 'geogrid',
    name: 'GeoGrid',
    description: 'Paste your share text to score.',
    link: 'https://www.geogridgame.com/',
    icon: Percent,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Score: 106.4 | Rank: 668/9,826
I scored better than 93.2% of #geogridgame players!`
  },
  {
    id: 'boardle',
    name: 'Boardle',
    description: 'Paste your share text to score.',
    link: 'https://playboardle.com/',
    icon: Grid,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Boardle 1072 2/5
🟩🟩🟩⬜⬜
🟩🟩🟩🟩🟩`
  },
  {
    id: 'emovi',
    name: 'Emovi',
    description: 'Paste your full "Share" text with the emoji grid.',
    link: 'https://emovi.teuteuf.fr/',
    icon: Film,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Emovi 🎬 #1076
🟥🟥🟩
https://emovi.teuteuf.fr`
  },
  {
    id: 'foodguessr',
    name: 'FoodGuessr',
    description: 'Paste your share text to score.',
    link: 'https://www.foodguessr.com/',
    icon: Utensils,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `Total score: 14,000 / 15,000
https://foodguessr.com`
  },
  {
    id: 'guess-the-game',
    name: 'Guess the Game',
    description: 'Paste your share text to score.',
    link: 'https://guessthe.game/',
    icon: Gamepad2,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `#GuessTheGame #1139
🎮 🟥 🟥 🟩 ⬜ ⬜ ⬜
#RookieGuesser`
  },
  {
    id: 'pokedoku',
    name: 'PokeDoku',
    description: 'Paste your share text to score.',
    link: 'https://pokedoku.com/',
    icon: BrainCircuit,
    scoreInputType: 'text',
    scoringStatus: 'implemented',
    exampleShareText: `🌟 PokeDoku Champion 🌟
Score: 9/9
Uniqueness: 159/93 ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅`
  },
];
