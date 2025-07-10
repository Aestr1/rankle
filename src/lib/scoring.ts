
/**
 * @fileOverview Provides functions for normalizing game scores to a 0-100 scale.
 */

/**
 * Normalizes a raw score for a given game into a 0-100 scale where higher is always better.
 * @param gameId The ID of the game (e.g., 'wordle', 'timeguessr').
 * @param rawScore The score as entered by the user.
 * @returns The normalized score (0-100).
 * @throws An error if the gameId is not recognized.
 */
export function normalizeScore(gameId: string, rawScore: number): number {
    let normalizedScore: number;

    switch (gameId) {
        // Games where a lower number of guesses is better
        case 'wordle':
        case 'hexle':
        case 'guess-the-game':
        case 'emovi': { // Now a 6-guess game
            // Linear scale where 1 guess = 100, 7 (fail) = 0.
            if (rawScore >= 7) return 0; // Fail state
            if (rawScore < 1) return 100; // Edge case
            normalizedScore = 100 * (1 - (rawScore - 1) / 6);
            break;
        }

        case 'boardle': { // 5-guess game
            if (rawScore >= 6) return 0; // Fail state
            if (rawScore < 1) return 100;
            normalizedScore = 100 * (1 - (rawScore - 1) / 5);
            break;
        }

        case 'squirdle': { // 9-guess game, punishing
            if (rawScore >= 10) return 0; // Fail state
            if (rawScore < 1) return 100;
            // Use an exponential curve to punish higher guesses more
            normalizedScore = 100 * (1 - Math.pow((rawScore - 1) / 9, 0.5));
            break;
        }

        case 'globle': { // 8-guess target
            if (rawScore < 1) return 100;
            if (rawScore > 8) return 0; // Treat >8 as a fail for scoring
            normalizedScore = 100 * (1 - (rawScore - 1) / 8);
            break;
        }

        // Games where a higher score is better
        case 'cyphr': // max 28
            normalizedScore = (rawScore / 28) * 100;
            break;
        case 'pokedoku': // max 9
            normalizedScore = (rawScore / 9) * 100;
            break;
        case 'timeguessr': // max 50000
            normalizedScore = (rawScore / 50000) * 100;
            break;
        case 'foodguessr': // max 15000
            normalizedScore = (rawScore / 15000) * 100;
            break;
            
        // Games with specific logic
        case 'geogrid': // raw score is percentile
            normalizedScore = rawScore;
            break;
        
        case 'victordle': // Binary win/loss
            normalizedScore = rawScore === 1 ? 100 : 0;
            break;

        case 'connections': // rawScore is number of solved groups (0-4)
            normalizedScore = rawScore * 25;
            break;

        case 'strands': {
            // rawScore is number of hints. Lower is better. 0 is perfect.
            if (rawScore === 100) return 0; // Failure case (no spangram)
            if (rawScore === 0) return 100; // Perfect score
            // Let's say max reasonable hints is 8
            normalizedScore = 100 - (rawScore * 12.5);
            break;
        }

        case 'mini-crossword': {
            // rawScore is time in seconds. Lower is better.
            const maxTime = 180; // 3 minutes
            if (rawScore > maxTime) return 0;
            if (rawScore <= 20) return 100; // Excellent time
            normalizedScore = 100 - ((rawScore - 20) / (maxTime - 20)) * 100;
            break;
        }

        // Fallback for existing games not in the list
        case 'worldle': {
             const scoreMap: {[key: number]: number} = { 1: 100, 2: 95, 3: 90, 4: 80, 5: 65, 6: 50, 7: 0 };
             normalizedScore = scoreMap[rawScore] ?? 0;
             break;
        }

        default:
            throw new Error(`Scoring algorithm not implemented for game: "${gameId}".`);
    }
    
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
}
