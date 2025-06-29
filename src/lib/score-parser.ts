/**
 * @fileOverview Parses share text from games to extract a raw numerical score.
 */

/**
 * Extracts a raw numerical score from a game's share text.
 * @param gameId The ID of the game.
 * @param shareText The text pasted by the user.
 * @returns A raw numerical score, or null if parsing fails.
 */
export function parseRawScore(gameId: string, shareText: string): number | null {
  // Specific parsing logic per game
  switch (gameId) {
    case 'timeguessr': {
      // Look for "39,838/50,000" format
      const scoreMatch = shareText.match(/(\d{1,3}(?:,\d{3})*)\/(\d{1,3}(?:,\d{3})*)/);
      if (scoreMatch && scoreMatch[1]) {
        const score = parseFloat(scoreMatch[1].replace(/,/g, ''));
        if (!isNaN(score)) {
          return score;
        }
      }
      // If regex fails, try parsing as a direct number (e.g., user just types "39838")
      const directTimeguessrScore = parseFloat(shareText);
      return isNaN(directTimeguessrScore) ? null : directTimeguessrScore;
    }

    case 'emovi': {
      const lines = shareText.split('\n');
      for (const line of lines) {
        // Find the line that consists of only the square emojis
        if (/^[🟩⬜🟥️⬛️]+$/.test(line.trim())) {
          const guessLine = line.trim();
          const guessIndex = guessLine.indexOf('🟩');
          if (guessIndex !== -1) {
            return guessIndex + 1; // 1-based guess count (1, 2, or 3)
          }
          // If no green square, it's a fail. It has 3 attempts.
          // Failure would be raw score 4.
          return 4;
        }
      }
      return null; // Could not find the emoji grid line
    }

    case 'wordle':
    case 'worldle': {
      // Look for "X/6" format
      const guessMatch = shareText.match(/([1-6X])\/6/);
      if (guessMatch && guessMatch[1]) {
        const result = guessMatch[1];
        if (result.toUpperCase() === 'X') {
          return 7; // Represents a fail state
        }
        const guesses = parseInt(result, 10);
        if (!isNaN(guesses)) {
          return guesses;
        }
      }
      return null; // Don't fall back to number parsing for these games
    }

    case 'globle': {
      const lines = shareText.split('\n');
      for (const line of lines) {
        // Look for a line like '... = 8'
        const match = line.match(/\s*=\s*(\d+)/);
        if (match && match[1]) {
          const score = parseInt(match[1], 10);
          if (!isNaN(score)) {
            return score;
          }
        }
      }
      // Fallback for just entering the number
      const directScore = parseFloat(shareText);
      return isNaN(directScore) ? null : directScore;
    }

    case 'connections': {
        const lines = shareText.split(/\r\n?|\n/);
        let emojiGridRows = 0;

        for (const line of lines) {
            const trimmedLine = line.trim();
            // A valid row must contain exactly 4 of these specific emojis.
            // The 'u' flag is critical for correct Unicode emoji parsing.
            if (/^[🟨🟩🟦🟪]{4}$/u.test(trimmedLine)) {
                emojiGridRows++;
            }
        }

        // If we found at least one emoji row, we assume it's a valid Connections entry.
        // It must have at least 4 rows to be a completed puzzle.
        if (emojiGridRows >= 4) {
            const mistakes = emojiGridRows - 4;
            return mistakes;
        }

        // Fallback for just entering the number of mistakes (0-4)
        const directMistakes = parseFloat(shareText);
        if (!isNaN(directMistakes) && directMistakes >= 0 && directMistakes <= 4) {
            return directMistakes;
        }
        
        return null;
    }

    // Default to direct number parsing for any other games
    default: {
      const directScore = parseFloat(shareText);
      return isNaN(directScore) ? null : directScore;
    }
  }
}
