
import { db } from "@/lib/firebase";
import type { Gameplay } from "@/types";
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, runTransaction, doc, increment } from "firebase/firestore";

/**
 * Adds a new gameplay record and updates the user's total score in a single transaction.
 */
export async function addGameplay(gameplayData: Omit<Gameplay, 'id' | 'playedAt'>): Promise<string> {
  const gameplayRef = doc(collection(db, "gameplays"));
  const userRef = doc(db, "users", gameplayData.userId);

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Add the new gameplay document
      transaction.set(gameplayRef, {
        ...gameplayData,
        playedAt: Timestamp.now(),
      });
      
      // 2. Atomically increment the user's total score
      // We don't need to check for featured games here, because they call onComplete with score 0
      // and this function is only called for scores > 0 from the GameCard component.
      transaction.update(userRef, {
          totalScore: increment(gameplayData.score)
      });
    });
    return gameplayRef.id;
  } catch (error) {
    console.error("Error adding gameplay document transactionally: ", error);
    throw new Error("Could not save score and update rank.");
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
 * Fetches all gameplay records for a specific group across all time.
 */
export async function getAllGroupGameplays(groupId: string): Promise<Gameplay[]> {
  const q = query(
    collection(db, "gameplays"),
    where("groupId", "==", groupId)
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

/**
 * Fetches all gameplay records for a specific user for a given date.
 */
export async function getUserGameplaysForDate(userId: string, date: Date): Promise<Gameplay[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, "gameplays"),
    where("userId", "==", userId),
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
