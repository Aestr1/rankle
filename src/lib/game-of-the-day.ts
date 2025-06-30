
import { LIBRARY_GAMES_DATA } from '@/lib/library-game-data';
import type { Game, LibraryGame } from '@/types';
import { Star } from 'lucide-react';

// Simple pseudo-random number generator to ensure the same game is chosen for the same day
function seededRandom(seed: number) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Function to select a game based on weighted ratings
function getWeightedRandomGame(games: LibraryGame[], seed: number): LibraryGame {
    const totalWeight = games.reduce((sum, game) => sum + game.rating, 0);
    let random = seededRandom(seed) * totalWeight;

    for (const game of games) {
        random -= game.rating;
        if (random <= 0) {
            return game;
        }
    }
    // Fallback to the first game in case of rounding errors
    return games[0];
}

/**
 * Gets the featured game of the day, chosen from the library with weighted randomness.
 * The selection is deterministic for any given day.
 * @returns A Game object representing the game of the day.
 */
export function getGameOfTheDay(): Game {
    const today = new Date();
    // Create a unique seed for the current day
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const chosenLibraryGame = getWeightedRandomGame(LIBRARY_GAMES_DATA, seed);

    // Convert the LibraryGame to a Game object to be used in the UI
    const gameOfTheDay: Game = {
        ...chosenLibraryGame,
        icon: Star,
        description: "Today's featured game! Scores are for fun and won't affect your rank.",
        scoreInputType: 'text',
        isFeatured: true,
    };
    
    return gameOfTheDay;
}
