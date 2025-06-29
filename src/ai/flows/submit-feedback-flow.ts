
'use server';
/**
 * @fileOverview A flow for securely submitting user feedback to Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { useAuth } from '@/contexts/auth-context';

// Schema for submitting feedback
const SubmitFeedbackInputSchema = z.object({
  type: z.enum(['suggestion', 'bug']),
  subject: z.string(),
  description: z.string(),
  userId: z.string().optional().describe("The UID of the user submitting the feedback, if they are logged in."),
});
export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackInputSchema>;

const SubmitFeedbackOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type SubmitFeedbackOutput = z.infer<typeof SubmitFeedbackOutputSchema>;


export async function submitFeedback(input: SubmitFeedbackInput): Promise<SubmitFeedbackOutput> {
  return submitFeedbackFlow(input);
}


const submitFeedbackFlow = ai.defineFlow(
  {
    name: 'submitFeedbackFlow',
    inputSchema: SubmitFeedbackInputSchema,
    outputSchema: SubmitFeedbackOutputSchema,
  },
  async (input) => {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return { success: false, error: "Server configuration error." };
    }

    try {
      await adminDb.collection('feedback').add({
        ...input,
        submittedAt: FieldValue.serverTimestamp(),
        status: 'new', // default status
      });
      return { success: true };
    } catch (error) {
      console.error("Error submitting feedback to Firestore:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      return { success: false, error: `Failed to submit feedback: ${errorMessage}` };
    }
  }
);
