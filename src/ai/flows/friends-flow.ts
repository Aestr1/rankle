
'use server';
/**
 * @fileOverview AI-adjacent flows for managing friends.
 * These flows use the admin SDK to securely interact with Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { AppUser } from '@/types';

// Schema for adding a friend
const AddFriendInputSchema = z.object({
  currentUserUid: z.string(),
  friendEmail: z.string().email(),
});
export type AddFriendInput = z.infer<typeof AddFriendInputSchema>;

const AddFriendOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});
export type AddFriendOutput = z.infer<typeof AddFriendOutputSchema>;

// Schema for getting friends
const GetFriendsInputSchema = z.object({
  userUid: z.string(),
});
export type GetFriendsInput = z.infer<typeof GetFriendsInputSchema>;

// The output is an array of AppUser objects
const GetFriendsOutputSchema = z.array(z.any());


// Exported functions that the client will call
export async function addFriendByEmail(input: AddFriendInput): Promise<AddFriendOutput> {
  return addFriendFlow(input);
}

export async function getFriends(input: GetFriendsInput): Promise<AppUser[]> {
  return getFriendsFlow(input);
}


// Genkit flow for adding a friend
const addFriendFlow = ai.defineFlow(
  {
    name: 'addFriendFlow',
    inputSchema: AddFriendInputSchema,
    outputSchema: AddFriendOutputSchema,
  },
  async ({ currentUserUid, friendEmail }) => {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return { success: false, error: "Server configuration error." };
    }

    const friendEmailLower = friendEmail.toLowerCase();
    
    // 1. Find the user to add as a friend
    const usersRef = adminDb.collection('users');
    const friendQuery = usersRef.where('email', '==', friendEmailLower).limit(1);
    const friendSnapshot = await friendQuery.get();

    if (friendSnapshot.empty) {
      return { success: false, error: "No user found with that email address." };
    }

    const friendDoc = friendSnapshot.docs[0];
    const friendUid = friendDoc.id;

    if (friendUid === currentUserUid) {
        return { success: false, error: "You cannot add yourself as a friend."};
    }

    // 2. Check if they are already friends
    const currentUserDoc = await usersRef.doc(currentUserUid).get();
    const currentUserData = currentUserDoc.data() as AppUser | undefined;

    if (currentUserData?.friendUids?.includes(friendUid)) {
      return { success: false, error: "You are already friends with this user." };
    }

    // 3. Add friend relationship reciprocally in a batch
    const batch = adminDb.batch();

    const currentUserRef = usersRef.doc(currentUserUid);
    batch.update(currentUserRef, {
      friendUids: FieldValue.arrayUnion(friendUid)
    });

    const friendRef = usersRef.doc(friendUid);
    batch.update(friendRef, {
      friendUids: FieldValue.arrayUnion(currentUserUid)
    });

    await batch.commit();

    return { success: true, message: `You are now friends with ${friendDoc.data().displayName || friendEmail}.` };
  }
);


// Genkit flow for retrieving a user's friends
const getFriendsFlow = ai.defineFlow(
    {
        name: 'getFriendsFlow',
        inputSchema: GetFriendsInputSchema,
        outputSchema: GetFriendsOutputSchema,
    },
    async ({ userUid }) => {
        const adminDb = getAdminDb();
        if (!adminDb) return [];
        
        const userRef = adminDb.collection('users').doc(userUid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) return [];
        
        const userData = userDoc.data() as AppUser;
        const friendUids = userData.friendUids;

        if (!friendUids || friendUids.length === 0) return [];
        
        // Fetch friend documents. Note: 'in' query is limited to 30 UIDs.
        // For an alpha this is fine. For scale, this might need another approach.
        const friendsQuery = await adminDb.collection('users').where(FieldValue.documentId(), 'in', friendUids).get();

        const friends: AppUser[] = friendsQuery.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                displayName: data.displayName || null,
                email: data.email || null,
                photoURL: data.photoURL || null,
            };
        });

        return friends;
    }
);
