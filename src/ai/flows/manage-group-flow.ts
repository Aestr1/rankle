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
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, arrayUnion, doc } from "firebase/firestore";

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

// Genkit flow for creating a group
const createGroupFlow = ai.defineFlow(
  {
    name: 'createGroupFlow',
    inputSchema: CreateGroupInputSchema,
    outputSchema: CreateGroupOutputSchema,
  },
  async (input) => {
    const { groupName, selectedGames, joinCode, user } = input;
    const lowerCaseJoinCode = joinCode.toLowerCase();

    // 1. Check for unique join code (runs with server permissions)
    const q = query(collection(db, "groups"), where("joinCode", "==", lowerCaseJoinCode));
    const querySnapshot = await getDocs(q);
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
      createdAt: serverTimestamp(),
    };

    const groupDocRef = await addDoc(collection(db, "groups"), newGroup);
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
        const { joinCode, user } = input;
        const lowerCaseJoinCode = joinCode.toLowerCase();
        
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("joinCode", "==", lowerCaseJoinCode));
        const querySnapshot = await getDocs(q);

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

        await updateDoc(doc(db, "groups", groupDoc.id), {
            members: arrayUnion({
                uid: user.uid,
                displayName: user.displayName,
            }),
            memberUids: arrayUnion(user.uid)
        });

        return {
            groupId: groupDoc.id,
            groupName: groupData.name,
        };
    }
);
