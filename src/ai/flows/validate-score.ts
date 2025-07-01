'use server';

/**
 * @fileOverview AI agent for validating submitted game scores.
 *
 * - validateScore - A function that validates the submitted score.
 * - ValidateScoreInput - The input type for the validateScore function.
 * - ValidateScoreOutput - The return type for the validateScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateScoreInputSchema = z.object({
  gameName: z.string().describe('The name of the game.'),
  playerName: z.string().describe('The name of the player submitting the score.'),
  score: z.number().describe('The score submitted by the player.'),
  previousScores: z
    .array(z.number())
    .describe('The player\'s previous scores for the game.'),
});
export type ValidateScoreInput = z.infer<typeof ValidateScoreInputSchema>;

const ValidateScoreOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the score is valid or not, based on the player\'s history.'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the score is valid or invalid. Explain in detail the determination of the score being valid or invalid.'
    ),
});
export type ValidateScoreOutput = z.infer<typeof ValidateScoreOutputSchema>;

export async function validateScore(input: ValidateScoreInput): Promise<ValidateScoreOutput> {
  return validateScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateScorePrompt',
  input: {schema: ValidateScoreInputSchema},
  output: {schema: ValidateScoreOutputSchema},
  prompt: `You are an expert game score validator.

You will be provided with the game name, player name, submitted score, and the player's previous scores.

Based on this information, you will determine if the submitted score is valid or not.

Consider the player's previous scores and the game name when making your determination.

Game Name: {{{gameName}}}
Player Name: {{{playerName}}}
Submitted Score: {{{score}}}
Player's Previous Scores: {{{previousScores}}}

Set the isValid output field to true if the score is valid, and false if it is not.
Provide a detailed reason for your determination in the reason output field. Be very descriptive. 
`,
});

const validateScoreFlow = ai.defineFlow(
  {
    name: 'validateScoreFlow',
    inputSchema: ValidateScoreInputSchema,
    outputSchema: ValidateScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
