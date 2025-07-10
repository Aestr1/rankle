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
        case 'emovi': {
            // 3-guess game
            const scoreMap: {[key: number]: number} = {
                1: 100, // 1st try
                2: 75,  // 2nd try
                3: 50,  // 3rd try
                4: 0,   // Fail state
            };
            normalizedScore = scoreMap[rawScore] ?? 0;
            break;
        }
        // Games where a lower number of guesses is better (out of 6)
        case 'wordle':
        case 'worldle':
             // This scoring curve is weighted to reward an average score (4/6) more highly.
             const scoreMap: {[key: number]: number} = {
                 1: 100, // Perfect
                 2: 95,
                 3: 90,
                 4: 80,  // "B" grade
                 5: 65,
                 6: 50,
                 7: 0,   // Fail state (X/6)
             };
             normalizedScore = scoreMap[rawScore] ?? 0;
             break;

        // Games where score is a percentage of a max score
        case 'timeguessr':
            // Max score is 50,000 based on share text format
            normalizedScore = (rawScore / 50000) * 100;
            break;
        
        // Connections: raw score is number of mistakes (0-4)
        case 'connections':
            // This weighted curve gives a bonus for a perfect game.
            const mistakeMap: {[key: number]: number} = {
                0: 100, // Perfect!
                1: 85,
                2: 65,
                3: 40,
                4: 15,
            };
            normalizedScore = mistakeMap[rawScore] ?? 0;
            break;

        // Globle: Lower number of guesses is better (unlimited guesses)
        case 'globle':
            normalizedScore = Math.max(0, 100 - (rawScore - 1) * 4);
            break;

        case 'strands': {
            // rawScore is number of hints. Lower is better. 0 is perfect.
            // 100 is a special value for failure.
            if (rawScore === 100) return 0; // Failure case
            if (rawScore === 0) return 100; // Perfect score
            // Give diminishing returns for each hint used.
            normalizedScore = 100 - (rawScore * 15);
            break;
        }

        case 'mini-crossword': {
            // rawScore is time in seconds. Lower is better.
            // Let's set a "par" time of 60 seconds for a good score, and a max of 3 minutes.
            const maxTime = 180; // 3 minutes
            if (rawScore > maxTime) return 0;
            if (rawScore <= 20) return 100; // Excellent time
            normalizedScore = 100 - ((rawScore - 20) / (maxTime - 20)) * 100;
            break;
        }

        default:
            // For any games not explicitly handled, we can't normalize.
            // Throwing an error is the safest way to highlight this.
            throw new Error(`Scoring algorithm not implemented for game: "${gameId}".`);
    }
    
    // Clamp the score between 0 and 100 and round to nearest integer
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
}
