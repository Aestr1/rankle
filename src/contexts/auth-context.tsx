
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { AppUser } from "@/types";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as AppUser);
        } else {
          // Should have been created by signInWithGoogle, but as a fallback:
           const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: serverTimestamp(),
            friendUids: [],
          };
          await setDoc(userRef, newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addUserToFirestore = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp(),
        friendUids: [],
      };
      try {
        await setDoc(userRef, newUser);
        setCurrentUser(newUser); 
      } catch (error) {
        console.error("Error creating user document:", error);
      }
    } else {
       setCurrentUser(docSnap.data() as AppUser);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await addUserToFirestore(result.user);
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      if (error.code === 'auth/popup-closed-by-user') {
          toast({
              title: "Sign-In Window Closed",
              description: "The sign-in window was closed before completing. This can happen if the Firebase project is not configured correctly. Please double-check your settings.",
              variant: "destructive",
              duration: 10000,
          });
      } else if (error.code === 'auth/unauthorized-domain') {
        toast({
          title: "Configuration Error",
          description: (
            <div className="text-sm">
              <p>This app's domain is not authorized for Firebase Sign-In.</p>
              <p className="mt-2 font-semibold">Please check the following:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Go to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains.</li>
                <li>Ensure <strong>localhost</strong> is added to the list.</li>
                <li>Ensure the keys in your <strong>.env</strong> file are correct.</li>
                <li className="font-bold">You MUST restart the dev server after changing the .env file.</li>
              </ul>
            </div>
          ),
          variant: "destructive",
          duration: 20000,
        });
      } else {
         toast({
          title: "Sign-In Failed",
          description: error.message || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign-Out Error",
        description: error.message || "Could not sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
