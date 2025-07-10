
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
      const scoreMatch = shareText.match(/(\d{1,3}(?:,\d{3})*)\/(\d{1,3}(?:,\d{3})*)/);
      if (scoreMatch && scoreMatch[1]) {
        return parseFloat(scoreMatch[1].replace(/,/g, ''));
      }
      const directTimeguessrScore = parseFloat(shareText);
      return isNaN(directTimeguessrScore) ? null : directTimeguessrScore;
    }

    case 'foodguessr': {
      const scoreMatch = shareText.match(/Total score: (\d{1,3}(?:,\d{3})*)/);
      if (scoreMatch && scoreMatch[1]) {
        return parseFloat(scoreMatch[1].replace(/,/g, ''));
      }
      return null;
    }

    case 'emovi': {
      const lines = shareText.split('\n');
      for (const line of lines) {
        if (/^[🟩⬜🟥️⬛️]+$/.test(line.trim())) {
          const guessLine = line.trim();
          const guessIndex = guessLine.indexOf('🟩');
          // It's a 6-frame game now, not 3.
          if (guessIndex !== -1) {
            return guessIndex + 1; // 1-based guess count (1-6)
          }
          return 7; // Fail state
        }
      }
      // Look for the older 3-emoji format as a fallback
      const oldFormatMatch = shareText.match(/^(?:[🟥⬜]{2}🟩|[🟥⬜]🟩⬜|🟩⬜⬜)$/m);
      if (oldFormatMatch) {
        const line = oldFormatMatch[0];
        return line.indexOf('🟩') + 1;
      }
      return null;
    }

    case 'guess-the-game':
    case 'hexle':
    case 'wordle':
    case 'worldle': {
      const guessMatch = shareText.match(/([1-6X])\/6/);
      if (guessMatch && guessMatch[1]) {
        return guessMatch[1].toUpperCase() === 'X' ? 7 : parseInt(guessMatch[1], 10);
      }
      return null;
    }
    
    case 'boardle': {
      const guessMatch = shareText.match(/([1-5X])\/5/);
      if (guessMatch && guessMatch[1]) {
        return guessMatch[1].toUpperCase() === 'X' ? 6 : parseInt(guessMatch[1], 10);
      }
      return null;
    }

    case 'squirdle': {
      const guessMatch = shareText.match(/(\d+)\/9/);
       if (guessMatch && guessMatch[1]) {
        const guesses = parseInt(guessMatch[1], 10);
        // Squirdle doesn't have an explicit fail state in the X/Y text, it just maxes out at 9
        // We'll treat 9 guesses as the "worst" win, and user has to tell us they failed.
        return isNaN(guesses) ? 10 : guesses; // Assume 10 for fail
      }
      if (shareText.toLowerCase().includes('fail')) return 10;
      return null;
    }

    case 'victordle': {
      if (/I beat my opponent/i.test(shareText)) {
        return 1; // Win
      }
      if (/I lost to my opponent/i.test(shareText)) {
        return 0; // Loss
      }
      return null;
    }

    case 'cyphr': {
      const scoreMatch = shareText.match(/Score: (\d+)\/28/);
      if (scoreMatch && scoreMatch[1]) {
        return parseInt(scoreMatch[1], 10);
      }
      return null;
    }
    
    case 'pokedoku': {
      const scoreMatch = shareText.match(/Score: (\d+)\/9/);
      if (scoreMatch && scoreMatch[1]) {
        return parseInt(scoreMatch[1], 10);
      }
      return null;
    }

    case 'globle': {
      const match = shareText.match(/=\s*(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
      return null;
    }
    
    case 'geogrid': {
       const percentileMatch = shareText.match(/better than ([\d.]+)%/);
       if (percentileMatch && percentileMatch[1]) {
           return parseFloat(percentileMatch[1]);
       }
       return null;
    }

    case 'connections': {
        const lines = shareText.split(/\r\n?|\n/);
        let mistakeCount = 0;
        let solvedGroupCount = 0;
        const validEmojis = ['🟨', '🟩', '🟦', '🟪'];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0) continue;

            const chars = Array.from(trimmedLine);
            if (chars.length === 4 && chars.every(char => validEmojis.includes(char))) {
                const firstEmoji = chars[0];
                const isSolvedGroup = chars.every(emoji => emoji === firstEmoji);
                
                if (isSolvedGroup) {
                    solvedGroupCount++;
                } else {
                    mistakeCount++;
                }
            }
        }
        // This logic is tricky. Let's count solved groups instead.
        // It's a better representation of "score".
        return solvedGroupCount;
    }

    case 'strands': {
      if (!shareText.includes('🟡')) {
        return 100; // Special value for failure (no spangram)
      }
      const hintMatch = shareText.match(/💡/g);
      return hintMatch ? hintMatch.length : 0;
    }

    case 'mini-crossword': {
      const timeMatch = shareText.match(/in\s+(\d+):(\d+)/);
      if (timeMatch && timeMatch[1] && timeMatch[2]) {
        return (parseInt(timeMatch[1], 10) * 60) + parseInt(timeMatch[2], 10);
      }
      const directSeconds = parseFloat(shareText);
      return isNaN(directSeconds) ? null : directSeconds;
    }

    default: {
      const directScore = parseFloat(shareText);
      return isNaN(directScore) ? null : directScore;
    }
  }
}
