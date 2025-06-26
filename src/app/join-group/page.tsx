"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';

// Firebase imports
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trophy, UserPlus, Loader2 } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { AppFooter } from '@/components/app-footer';

const joinGroupSchema = z.object({
  joinCode: z.string().min(1, { message: "Join code cannot be empty." }),
});

type JoinGroupFormData = z.infer<typeof joinGroupSchema>;

export default function JoinGroupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<JoinGroupFormData>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      joinCode: "",
    },
  });

  const onSubmit: SubmitHandler<JoinGroupFormData> = async (data) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a group.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    
    try {
        const lowerCaseJoinCode = data.joinCode.toLowerCase();
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("joinCode", "==", lowerCaseJoinCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({
                title: "Group Not Found",
                description: `Could not find a group with code "${data.joinCode}". Please check the code and try again.`,
                variant: "destructive",
            });
        } else {
            const groupDoc = querySnapshot.docs[0];
            const groupData = groupDoc.data();

            if (groupData.memberUids.includes(currentUser.uid)) {
                toast({
                    title: "Already in Group",
                    description: `You are already a member of "${groupData.name}".`,
                });
                router.push(`/my-groups/${groupDoc.id}`);
                return;
            }

            await updateDoc(doc(db, "groups", groupDoc.id), {
                members: arrayUnion({
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                }),
                memberUids: arrayUnion(currentUser.uid)
            });

            toast({
                title: "Successfully Joined Group!",
                description: `You are now a member of "${groupData.name}".`,
            });
            router.push(`/my-groups/${groupDoc.id}`);
        }
    } catch (error) {
        console.error("Error joining group:", error);
        toast({
            title: "Error Joining Group",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Trophy className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-headline text-primary">Rankle</h1>
          </Link>
          <AuthButton />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-start">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <UserPlus className="mr-3 h-8 w-8 text-accent" />
              Join a Play Group
            </CardTitle>
            <CardDescription>
              Enter the join code/password shared by the group creator.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="joinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Group Join Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter code..." {...field} className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading || !currentUser} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining Group...
                    </>
                  ) : !currentUser ? (
                    "Sign in to Join Group"
                  ) : (
                    "Join Play Group"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
