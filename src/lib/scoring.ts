
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
        // Games where a lower number of guesses is better (out of 6)
        case 'wordle':
        case 'worldle':
        case 'emovi':
        case 'bandle':
             if (rawScore > 6) { // Fail state (e.g., parser returns 7 for 'X/6')
                normalizedScore = 0;
             } else {
                // This gives a range from 100 (1 guess) to 20 (6 guesses)
                normalizedScore = 100 - (rawScore - 1) * 16;
             }
             break;

        // Games where score is a percentage of a max score
        case 'timeguessr':
        case 'geoguessr':
            // Max score for both is 25,000
            normalizedScore = (rawScore / 25000) * 100;
            break;
        
        // Connections: raw score is number of mistakes (0-4)
        case 'connections':
            normalizedScore = 100 - rawScore * 25;
            break;

        // Globle: Lower number of guesses is better (unlimited guesses)
        case 'globle':
            normalizedScore = Math.max(0, 100 - (rawScore - 1) * 4);
            break;

        // WikiSpeedrun: Time-based (lower is better, in seconds)
        case 'wikispeedrun':
            normalizedScore = Math.max(0, 100 - rawScore / 5);
            break;

        default:
            // For any games not explicitly handled, we can't normalize.
            // Throwing an error is the safest way to highlight this.
            throw new Error(`Scoring algorithm not implemented for game: "${gameId}".`);
    }
    
    // Clamp the score between 0 and 100 and round to nearest integer
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
}
