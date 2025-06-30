'use server';
/**
 * @fileOverview AI-adjacent flows for managing play groups.
 * These flows run on the server and have secure access to Firestore.
 *
 * - createPlayGroup - Creates a new group, ensuring the join code is unique.
 * - joinPlayGroup - Allows a user to join an existing group using a join code.
 * - deleteGroup - Allows the group creator to delete the group.
 * - leaveGroup - Allows a member to leave a group.
 * - getPublicGroups - Fetches all public groups with search and sort.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAdminDb } from '@/lib/firebase-admin'; // Use the Admin SDK
import { FieldValue, collection, query, where, getDocs } from 'firebase-admin/firestore'; // Use the Admin SDK's FieldValue
import type { PlayGroup } from '@/types';

// Input schema for creating a group
const CreateGroupInputSchema = z.object({
  groupName: z.string(),
  selectedGames: z.array(z.string()),
  joinCode: z.string(),
  isPublic: z.boolean(),
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

// Input schema for deleting a group
const DeleteGroupInputSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
});
export type DeleteGroupInput = z.infer<typeof DeleteGroupInputSchema>;

// Output schema for deleting/leaving
const MutateGroupOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type MutateGroupOutput = z.infer<typeof MutateGroupOutputSchema>;

// Input schema for leaving a group
const LeaveGroupInputSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
  userDisplayName: z.string().nullable(),
});
export type LeaveGroupInput = z.infer<typeof LeaveGroupInputSchema>;

// Input schema for getting public groups
const GetPublicGroupsInputSchema = z.object({
    searchTerm: z.string().optional(),
    sortBy: z.enum(['newest', 'members']).default('members'),
});
export type GetPublicGroupsInput = z.infer<typeof GetPublicGroupsInputSchema>;

const GetPublicGroupsOutputSchema = z.array(z.any());


// Exported functions that the client will call
export async function createPlayGroup(input: CreateGroupInput): Promise<CreateGroupOutput> {
  return createGroupFlow(input);
}

export async function joinPlayGroup(input: JoinGroupInput): Promise<JoinGroupOutput> {
  return joinGroupFlow(input);
}

export async function deleteGroup(input: DeleteGroupInput): Promise<MutateGroupOutput> {
    return deleteGroupFlow(input);
}

export async function leaveGroup(input: LeaveGroupInput): Promise<MutateGroupOutput> {
    return leaveGroupFlow(input);
}

export async function getPublicGroups(input: GetPublicGroupsInput): Promise<PlayGroup[]> {
    return getPublicGroupsFlow(input);
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

    const { groupName, selectedGames, joinCode, isPublic, user } = input;
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
      isPublic: isPublic,
      memberCount: 1,
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
            memberUids: FieldValue.arrayUnion(user.uid),
            memberCount: FieldValue.increment(1),
        });

        return {
            groupId: groupDoc.id,
            groupName: groupData.name,
        };
    }
);

// Genkit flow for deleting a group
const deleteGroupFlow = ai.defineFlow(
  {
    name: 'deleteGroupFlow',
    inputSchema: DeleteGroupInputSchema,
    outputSchema: MutateGroupOutputSchema,
  },
  async ({ groupId, userId }) => {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return { success: false, error: SERVER_CONFIG_ERROR };
    }
    
    const groupRef = adminDb.collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return { success: false, error: 'Group not found.' };
    }
    
    if (groupDoc.data()?.creatorId !== userId) {
      return { success: false, error: 'Only the group creator can delete this group.' };
    }

    await groupRef.delete();
    return { success: true };
  }
);

// Genkit flow for leaving a group
const leaveGroupFlow = ai.defineFlow(
  {
    name: 'leaveGroupFlow',
    inputSchema: LeaveGroupInputSchema,
    outputSchema: MutateGroupOutputSchema,
  },
  async ({ groupId, userId, userDisplayName }) => {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return { success: false, error: SERVER_CONFIG_ERROR };
    }
    
    const groupRef = adminDb.collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return { success: false, error: 'Group not found.' };
    }

    const groupData = groupDoc.data();
    if (groupData?.creatorId === userId) {
      return { success: false, error: 'Group creators cannot leave a group. You must delete it instead.' };
    }

    if (!groupData?.memberUids.includes(userId)) {
      return { success: false, error: 'You are not a member of this group.' };
    }

    await groupRef.update({
      members: FieldValue.arrayRemove({ uid: userId, displayName: userDisplayName }),
      memberUids: FieldValue.arrayRemove(userId),
      memberCount: FieldValue.increment(-1),
    });

    return { success: true };
  }
);


// Genkit flow for fetching public groups
const getPublicGroupsFlow = ai.defineFlow(
    {
        name: 'getPublicGroupsFlow',
        inputSchema: GetPublicGroupsInputSchema,
        outputSchema: GetPublicGroupsOutputSchema,
    },
    async ({ searchTerm, sortBy }) => {
        const adminDb = getAdminDb();
        if (!adminDb) return [];

        const groupsRef = collection(adminDb, 'groups');
        const q = query(groupsRef, where('isPublic', '==', true));
        const querySnapshot = await getDocs(q);
        
        let groups: PlayGroup[] = [];
        querySnapshot.forEach((doc) => {
            groups.push({ id: doc.id, ...doc.data() } as PlayGroup);
        });

        // Filter in memory since Firestore has query limitations
        if (searchTerm && searchTerm.trim() !== '') {
            const lowercasedTerm = searchTerm.toLowerCase();
            groups = groups.filter(group => group.name.toLowerCase().includes(lowercasedTerm));
        }

        // Sort in memory
        if (sortBy === 'newest') {
            groups.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return dateB - dateA;
            });
        } else { // Default to 'members' for popularity
            groups.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
        }

        return groups;
    }
);
