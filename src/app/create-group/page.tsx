
"use client";

import React, { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';

import { createPlayGroup, type CreateGroupInput } from '@/ai/flows/manage-group-flow';
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { LibraryGame, GameCategory } from "@/types";
import { LIBRARY_GAMES_DATA } from "@/lib/library-game-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { Switch } from '@/components/ui/switch';

const createGroupSchema = z.object({
  groupName: z.string().min(3, { message: "Group name must be at least 3 characters." }).max(50),
  selectedGames: z.array(z.string()).min(1, { message: "Select at least one game." }).max(20, { message: "You can select up to 20 games." }),
  joinCode: z.string().min(4, { message: "Join code must be at least 4 characters." }).max(20),
  isPublic: z.boolean().default(false),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export default function CreateGroupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<GameCategory | "all">("all");
  const [sortOrder, setSortOrder] = useState("popularity");

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupName: "",
      selectedGames: [],
      joinCode: "",
      isPublic: false,
    },
    mode: 'onBlur',
  });
  
  const categories: (GameCategory | "all")[] = ['all', ...Array.from(new Set(LIBRARY_GAMES_DATA.map(g => g.category)))];

  const filteredAndSortedGames = useMemo(() => {
    return LIBRARY_GAMES_DATA
      .filter(game => {
        const matchesCategory = categoryFilter === 'all' || game.category === categoryFilter;
        const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === 'popularity') {
          return b.rating - a.rating; // Higher rating first
        }
        if (sortOrder === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [searchTerm, categoryFilter, sortOrder]);


  const onSubmit: SubmitHandler<CreateGroupFormData> = async (data) => {
    // TEMPORARY: Dummy user for debugging without sign-in
    const dummyUser = {
        uid: 'DEBUG_USER_001',
        displayName: 'Debug User',
        photoURL: `https://placehold.co/100x100.png`,
    };

    const userToSubmit = currentUser ? {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
    } : dummyUser;

    setIsLoading(true);

    try {
      const input: CreateGroupInput = {
        groupName: data.groupName,
        selectedGames: data.selectedGames,
        joinCode: data.joinCode,
        isPublic: data.isPublic,
        user: userToSubmit,
      };

      const result = await createPlayGroup(input);
      
      if (result.error) {
        // Handle specific error for join code
        if (result.error.includes("join code is already in use")) {
            form.setError("joinCode", { type: "manual", message: result.error });
        } else {
            // Handle other errors (like the server config one)
            toast({
                title: "Error Creating Group",
                description: result.error,
                variant: "destructive",
                duration: 10000, // Show for longer
            });
        }
        setIsLoading(false);
        return;
      }
      
      if (result.groupId) {
        toast({
            title: "Group Created Successfully!",
            description: `Group "${data.groupName}" has been created.`,
        });
        setIsLoading(false);
        router.push(`/my-groups/${result.groupId}`);
      } else {
        throw new Error("Group creation failed unexpectedly.");
      }

    } catch (error) {
        console.error("Full error object from group creation:", error); // This will log the full error
        toast({
            title: "Error Creating Group",
            description: "Something went wrong. Check the developer console for more details.",
            variant: "destructive",
        });
        setIsLoading(false);
    }
  };

  return (
    <main className="container flex-grow p-4 md:p-8 flex justify-center items-start">
        <Card className="w-full max-w-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <PlusCircle className="mr-3 h-8 w-8 text-accent" />
              Create a New Play Group
            </CardTitle>
            <CardDescription>
              Set up a custom daily challenge for you and your friends. Select up to 20 games.
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
                        <Input placeholder="E.g., Weekend Warriors" {...field} className="text-base" autoComplete="off" />
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
                        <Input placeholder="E.g., WKD123" {...field} className="text-base" autoComplete="off" />
                      </FormControl>
                      <FormDescription>
                        Share this code with friends so they can join your group.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Make Group Public?
                        </FormLabel>
                        <FormDescription>
                          Public groups are visible to everyone on the browse page.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormItem>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <Input
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                            autoComplete="off"
                        />
                        <div className="flex gap-2">
                            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as GameCategory | "all")}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popularity">Popularity</SelectItem>
                                    <SelectItem value="name">Name (A-Z)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                  <FormLabel className="text-lg">Select Games (up to 20)</FormLabel>
                   <FormDescription>
                      Choose the games to include in this group's daily challenge.
                    </FormDescription>
                  <ScrollArea className="h-72 w-full rounded-md border p-4 mt-2">
                    <div className="space-y-3">
                      {filteredAndSortedGames.length > 0 ? filteredAndSortedGames.map((game: LibraryGame) => (
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
                                      if (currentSelection.length < 20) {
                                         field.onChange([...currentSelection, game.id]);
                                      } else {
                                        toast({ title: "Limit Reached", description: "You can only select up to 20 games.", variant: "destructive" });
                                      }
                                    } else {
                                      field.onChange(currentSelection.filter((value) => value !== game.id));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="flex flex-col">
                                <FormLabel className="font-normal text-base leading-tight">
                                    {game.name}
                                </FormLabel>
                                 <p className="text-xs text-muted-foreground">{game.category}</p>
                              </div>
                            </FormItem>
                          )}
                        />
                      )) : (
                        <p className="text-center text-muted-foreground py-8">No games match your search or filter.</p>
                      )}
                    </div>
                  </ScrollArea>
                  <FormMessage>{form.formState.errors.selectedGames?.message}</FormMessage>
                </FormItem>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Group...
                    </>
                  ) : (
                    "Create Play Group"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
    </main>
  );
}
