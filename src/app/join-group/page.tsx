
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';

// Server flow for joining a group
import { joinPlayGroup, type JoinGroupInput } from '@/ai/flows/manage-group-flow';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

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
      const input: JoinGroupInput = {
        joinCode: data.joinCode,
        user: {
            uid: currentUser.uid,
            displayName: currentUser.displayName
        }
      };

      const result = await joinPlayGroup(input);

      if (result.error) {
          toast({
              title: "Error Joining Group",
              description: result.error,
              variant: "destructive",
          });
          setIsLoading(false);
          return;
      } 
      
      if (result.groupId) {
          if (result.alreadyInGroup) {
                toast({
                  title: "Already in Group",
                  description: `You are already a member of "${result.groupName}".`,
              });
          } else {
              toast({
                  title: "Successfully Joined Group!",
                  description: `You are now a member of "${result.groupName}".`,
              });
          }
          setIsLoading(false);
          router.push(`/my-groups/${result.groupId}`);
      } else {
          throw new Error("Joining group failed unexpectedly.");
      }
    } catch (error) {
        console.error("Error joining group:", error);
        toast({
            title: "Error Joining Group",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
        setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow p-4 md:p-8 flex justify-center items-start">
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
                        <Input placeholder="Enter code..." {...field} className="text-base" autoComplete="off" />
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
  );
}
