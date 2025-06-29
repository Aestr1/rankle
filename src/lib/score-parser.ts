
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
  // The common pattern is a number of guesses out of a total, like "3/6".
  const guessMatch = shareText.match(/(\d)\/6/);
  if (guessMatch && guessMatch[1]) {
    const guesses = parseInt(guessMatch[1], 10);
    if (!isNaN(guesses)) {
      // For these games, the raw score IS the number of guesses.
      return guesses;
    }
  }

  // Fallback for cases where parsing fails.
  return null;
}
