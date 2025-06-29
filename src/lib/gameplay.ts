
import { db } from "@/lib/firebase";
import type { Gameplay } from "@/types";
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";

/**
 * Adds a new gameplay record to Firestore.
 */
export async function addGameplay(gameplayData: Omit<Gameplay, 'id' | 'playedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "gameplays"), {
      ...gameplayData,
      playedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding gameplay document: ", error);
    throw new Error("Could not save score.");
  }
}

/**
 * Fetches all gameplay records for a specific group for a given date.
 */
export async function getGroupGameplays(groupId: string, date: Date): Promise<Gameplay[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, "gameplays"),
    where("groupId", "==", groupId),
    where("playedAt", ">=", Timestamp.fromDate(startOfDay)),
    where("playedAt", "<=", Timestamp.fromDate(endOfDay))
  );

  const querySnapshot = await getDocs(q);
  const gameplays: Gameplay[] = [];
  querySnapshot.forEach((doc) => {
    gameplays.push({ id: doc.id, ...doc.data() } as Gameplay);
  });
  return gameplays;
}

/**
 * Fetches all global gameplay records for a given date.
 */
export async function getGlobalGameplays(date: Date): Promise<Gameplay[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, "gameplays"),
    where("groupId", "==", null),
    where("playedAt", ">=", Timestamp.fromDate(startOfDay)),
    where("playedAt", "<=", Timestamp.fromDate(endOfDay))
  );

  const querySnapshot = await getDocs(q);
  const gameplays: Gameplay[] = [];
  querySnapshot.forEach((doc) => {
    gameplays.push({ id: doc.id, ...doc.data() } as Gameplay);
  });
  return gameplays;
}


/**
 * Fetches all gameplay records for a specific user.
 */
export async function getUserGameplays(userId: string): Promise<Gameplay[]> {
    const q = query(
        collection(db, "gameplays"),
        where("userId", "==", userId),
        orderBy("playedAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    const gameplays: Gameplay[] = [];
    querySnapshot.forEach((doc) => {
        gameplays.push({ id: doc.id, ...doc.data() } as Gameplay);
    });
    return gameplays;
}
