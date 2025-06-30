
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import type { AppUser } from '@/types';
import { getFriends, addFriendByEmail } from '@/ai/flows/friends-flow';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, UserPlus, Loader2, Info, ArrowLeft } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { AppFooter } from '@/components/app-footer';
import { useToast } from "@/hooks/use-toast";

const addFriendSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type AddFriendFormData = z.infer<typeof addFriendSchema>;

export default function FriendsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [friends, setFriends] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<AddFriendFormData>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: { email: "" },
  });

  const fetchFriends = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const friendList = await getFriends({ userUid: currentUser.uid });
      setFriends(friendList);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast({
        title: "Error",
        description: "Could not fetch your friends list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (currentUser) {
      fetchFriends();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, authLoading, fetchFriends]);

  const onAddFriend: SubmitHandler<AddFriendFormData> = async (data) => {
    if (!currentUser) return;
    
    form.clearErrors();
    
    if (data.email.toLowerCase() === currentUser.email?.toLowerCase()) {
        form.setError("email", { message: "You can't add yourself as a friend." });
        return;
    }

    try {
      const result = await addFriendByEmail({ 
        currentUserUid: currentUser.uid, 
        friendEmail: data.email 
      });

      if (result.error) {
        form.setError("email", { message: result.error });
      } else {
        toast({
          title: "Friend Added!",
          description: result.message,
        });
        form.reset();
        fetchFriends(); // Refresh the friends list
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding a friend.",
        variant: "destructive",
      });
    }
  };

  const pageHeader = (
     <header className="py-4 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
             <Button variant="ghost" size="icon" asChild className="mr-2">
                <Link href="/" aria-label="Back to Home">
                    <ArrowLeft className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <Trophy className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-headline text-primary">Rankle</h1>
          </div>
          <AuthButton />
        </div>
      </header>
  );

  const renderContent = () => {
    if (authLoading || isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    if (!currentUser) {
        return (
             <Card className="shadow-lg mt-8">
                <CardContent className="p-6 text-center">
                <Info className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">Please sign in to manage your friends.</p>
                </CardContent>
            </Card>
        );
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-headline text-accent">
                        <UserPlus className="mr-3 h-7 w-7" />
                        Add a Friend
                    </CardTitle>
                    <CardDescription>Enter your friend's email address to add them.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onAddFriend)} className="space-y-4">
                           <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Friend's Email</FormLabel>
                                <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder="friend@example.com" {...field} autoComplete="off" />
                                </FormControl>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Add"}
                                </Button>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-headline text-accent">
                        <Users className="mr-3 h-7 w-7" />
                        Your Friends ({friends.length})
                    </CardTitle>
                    <CardDescription>This is your current list of friends.</CardDescription>
                </CardHeader>
                <CardContent>
                   {friends.length > 0 ? (
                        <ul className="space-y-4">
                            {friends.map(friend => (
                                <li key={friend.uid} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                                    <Avatar>
                                        <AvatarImage src={friend.photoURL || undefined} alt={friend.displayName || 'Friend'} />
                                        <AvatarFallback>{friend.displayName?.charAt(0) || '?'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{friend.displayName}</p>
                                        <p className="text-sm text-muted-foreground">{friend.email}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                   ) : (
                       <p className="text-muted-foreground text-center py-4">You haven't added any friends yet.</p>
                   )}
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
     <div className="flex flex-col min-h-screen bg-background">
      {pageHeader}
      <main className="flex-grow container mx-auto p-4 md:p-8">
         <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <Users className="mr-3 h-8 w-8 text-accent" />
              Friends
            </CardTitle>
            <CardDescription>
              Add friends to see how you stack up against them on group leaderboards.
            </CardDescription>
          </CardHeader>
        </Card>
        {renderContent()}
      </main>
      <AppFooter />
    </div>
  );
}
