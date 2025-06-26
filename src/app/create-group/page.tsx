"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';

// Server flow for creating a group
import { createPlayGroup, type CreateGroupInput } from '@/ai/flows/manage-group-flow';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GAMES_DATA } from "@/lib/game-data";
import type { Game as LibraryGame } from "@/types";
import { Trophy, PlusCircle, Loader2 } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { AppFooter } from '@/components/app-footer';

const createGroupSchema = z.object({
  groupName: z.string().min(3, { message: "Group name must be at least 3 characters." }).max(50),
  selectedGames: z.array(z.string()).min(1, { message: "Select at least one game." }).max(10, { message: "You can select up to 10 games." }),
  joinCode: z.string().min(4, { message: "Join code must be at least 4 characters." }).max(20),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export default function CreateGroupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupName: "",
      selectedGames: [],
      joinCode: "",
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<CreateGroupFormData> = async (data) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a group.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const input: CreateGroupInput = {
        groupName: data.groupName,
        selectedGames: data.selectedGames,
        joinCode: data.joinCode,
        user: {
          uid: currentUser.uid,
          displayName: currentUser.displayName
        }
      };

      const result = await createPlayGroup(input);
      
      if (result.error) {
        form.setError("joinCode", { type: "manual", message: result.error });
        setIsLoading(false);
        return;
      }
      
      if (result.groupId) {
        toast({
            title: "Group Created Successfully!",
            description: `Group "${data.groupName}" has been created.`,
        });
        router.push(`/my-groups/${result.groupId}`);
      } else {
        throw new Error("Group creation failed unexpectedly.");
      }

    } catch (error) {
        console.error("Error creating group:", error);
        toast({
            title: "Error Creating Group",
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
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <PlusCircle className="mr-3 h-8 w-8 text-accent" />
              Create a New Play Group
            </CardTitle>
            <CardDescription>
              Set up a custom daily challenge for you and your friends. Select up to 10 games.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Weekend Warriors" {...field} className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Set a Join Code / Password</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., WKD123" {...field} className="text-base" />
                      </FormControl>
                      <FormDescription>
                        Share this code with friends so they can join your group.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="text-lg">Select Games (up to 10)</FormLabel>
                   <FormDescription>
                      Choose the games to include in this group's daily challenge.
                    </FormDescription>
                  <ScrollArea className="h-72 w-full rounded-md border p-4 mt-2">
                    <div className="space-y-3">
                      {GAMES_DATA.map((game: LibraryGame) => (
                        <FormField
                          key={game.id}
                          control={form.control}
                          name="selectedGames"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 hover:bg-muted/50 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(game.id)}
                                  onCheckedChange={(checked) => {
                                    const currentSelection = field.value || [];
                                    if (checked) {
                                      if (currentSelection.length < 10) {
                                         field.onChange([...currentSelection, game.id]);
                                      } else {
                                        toast({ title: "Limit Reached", description: "You can only select up to 10 games.", variant: "destructive" });
                                      }
                                    } else {
                                      field.onChange(currentSelection.filter((value) => value !== game.id));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-base">
                                {game.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage>{form.formState.errors.selectedGames?.message}</FormMessage>
                </FormItem>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading || !currentUser} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Group...
                    </>
                  ) : !currentUser ? (
                    "Sign in to Create Group"
                  ) : (
                    "Create Play Group"
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
