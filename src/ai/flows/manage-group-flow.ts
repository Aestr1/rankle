'use server';
/**
 * @fileOverview AI-adjacent flows for managing play groups.
 * These flows run on the server and have secure access to Firestore.
 *
 * - createPlayGroup - Creates a new group, ensuring the join code is unique.
 * - joinPlayGroup - Allows a user to join an existing group using a join code.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAdminDb } from '@/lib/firebase-admin'; // Use the Admin SDK
import { FieldValue } from 'firebase-admin/firestore'; // Use the Admin SDK's FieldValue

// Input schema for creating a group
const CreateGroupInputSchema = z.object({
  groupName: z.string(),
  selectedGames: z.array(z.string()),
  joinCode: z.string(),
  user: z.object({
    uid: z.string(),
    displayName: z.string().nullable(),
  }),
});
export type CreateGroupInput = z.infer<typeof CreateGroupInputSchema>;

// Output schema for creating a group
const CreateGroupOutputSchema = z.object({
  groupId: z.string().optional(),
  error: z.string().optional(),
});
export type CreateGroupOutput = z.infer<typeof CreateGroupOutputSchema>;

// Input schema for joining a group
const JoinGroupInputSchema = z.object({
    joinCode: z.string(),
    user: z.object({
        uid: z.string(),
        displayName: z.string().nullable(),
    }),
});
export type JoinGroupInput = z.infer<typeof JoinGroupInputSchema>;

// Output schema for joining a group
const JoinGroupOutputSchema = z.object({
    groupId: z.string().optional(),
    groupName: z.string().optional(),
    error: z.string().optional(),
    alreadyInGroup: z.boolean().optional(),
});
export type JoinGroupOutput = z.infer<typeof JoinGroupOutputSchema>;


// Exported functions that the client will call
export async function createPlayGroup(input: CreateGroupInput): Promise<CreateGroupOutput> {
  return createGroupFlow(input);
}

export async function joinPlayGroup(input: JoinGroupInput): Promise<JoinGroupOutput> {
  return joinGroupFlow(input);
}

const SERVER_CONFIG_ERROR = "Server configuration error: The FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please add it to your .env file and restart the server.";

// Genkit flow for creating a group
const createGroupFlow = ai.defineFlow(
  {
    name: 'createGroupFlow',
    inputSchema: CreateGroupInputSchema,
    outputSchema: CreateGroupOutputSchema,
  },
  async (input) => {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return { error: SERVER_CONFIG_ERROR };
    }

    const { groupName, selectedGames, joinCode, user } = input;
    const lowerCaseJoinCode = joinCode.toLowerCase();

    // Use adminDb to bypass client-side security rules for this check
    const groupsRef = adminDb.collection("groups");
    const q = groupsRef.where("joinCode", "==", lowerCaseJoinCode);
    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
      return { error: "This join code is already in use. Please choose another." };
    }

    // 2. Create group document
    const newGroup = {
      name: groupName,
      gameIds: selectedGames,
      joinCode: lowerCaseJoinCode,
      creatorId: user.uid,
      creatorName: user.displayName,
      members: [{ uid: user.uid, displayName: user.displayName }],
      memberUids: [user.uid],
      createdAt: FieldValue.serverTimestamp(), // Use admin FieldValue
    };

    const groupDocRef = await groupsRef.add(newGroup);
    return { groupId: groupDocRef.id };
  }
);

// Genkit flow for joining a group
const joinGroupFlow = ai.defineFlow(
    {
        name: 'joinGroupFlow',
        inputSchema: JoinGroupInputSchema,
        outputSchema: JoinGroupOutputSchema,
    },
    async (input) => {
        const adminDb = getAdminDb();
        if (!adminDb) {
            return { error: SERVER_CONFIG_ERROR };
        }

        const { joinCode, user } = input;
        const lowerCaseJoinCode = joinCode.toLowerCase();
        
        // Use adminDb to bypass client-side security rules for this check
        const groupsRef = adminDb.collection("groups");
        const q = groupsRef.where("joinCode", "==", lowerCaseJoinCode);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
            return { error: `Could not find a group with code "${joinCode}". Please check the code and try again.` };
        } 
        
        const groupDoc = querySnapshot.docs[0];
        const groupData = groupDoc.data();

        if (groupData.memberUids.includes(user.uid)) {
            return {
                groupId: groupDoc.id,
                groupName: groupData.name,
                alreadyInGroup: true,
            };
        }

        await groupDoc.ref.update({
            members: FieldValue.arrayUnion({
                uid: user.uid,
                displayName: user.displayName,
            }),
            memberUids: FieldValue.arrayUnion(user.uid)
        });

        return {
            groupId: groupDoc.id,
            groupName: groupData.name,
        };
    }
);
