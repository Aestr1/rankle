
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
  // For games where user directly inputs a number, just parse it.
  switch (gameId) {
    case 'timeguessr':
    case 'geoguessr':
    case 'wikispeedrun':
    case 'globle':
    case 'connections':
      const directScore = parseFloat(shareText);
      return isNaN(directScore) ? null : directScore;
  }

  // For games that use a text/emoji format (e.g., Wordle, Worldle).
  // The common pattern is a number of guesses out of a total, like "3/6" or "X/6".
  const guessMatch = shareText.match(/([1-6X])\/6/);
  if (guessMatch && guessMatch[1]) {
    const result = guessMatch[1];
    if (result === 'X') {
      return 7; // Represents a fail state, more than 6 guesses
    }
    const guesses = parseInt(result, 10);
    if (!isNaN(guesses)) {
      return guesses;
    }
  }

  // Fallback for cases where parsing fails.
  return null;
}
