
"use client";

import type { Game, Gameplay } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateScore, type ValidateScoreInput } from "@/ai/flows/validate-score";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-context";
import { addGameplay } from "@/lib/gameplay";

interface GameCardProps {
  game: Game;
  isCompleted: boolean;
  onComplete: (gameId: string, score: number) => void;
  submittedScore?: number | null;
  groupId: string | null;
}

const scoreSchema = z.object({
  score: z.string().refine(val => !isNaN(parseFloat(val)) && val.trim() !== "", {
    message: "Score must be a number.",
  }),
});
type ScoreFormData = z.infer<typeof scoreSchema>;

export function GameCard({ game, isCompleted, onComplete, submittedScore, groupId }: GameCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const form = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      score: submittedScore?.toString() || "",
    },
  });

  const onSubmit: SubmitHandler<ScoreFormData> = async (data) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    const numericScore = parseFloat(data.score);

    const validationInput: ValidateScoreInput = {
      gameName: game.name,
      playerName: currentUser?.displayName || "RanklePlayer", 
      score: numericScore,
      previousScores: game.examplePreviousScores || [],
      averageScore: game.averageScore,
    };

    try {
      const result = await validateScore(validationInput);
      if (result.isValid) {
        const gameplayData: Omit<Gameplay, 'id' | 'playedAt'> = {
            userId: currentUser.uid,
            userDisplayName: currentUser.displayName || "Anonymous",
            gameId: game.id,
            groupId: groupId,
            score: numericScore
        };

        await addGameplay(gameplayData);
        
        toast({
          title: "Score Submitted!",
          description: (
            <div>
              <p>Your score for {game.name} is {numericScore}.</p>
              <p className="text-sm text-muted-foreground mt-1">AI Reason: {result.reason}</p>
            </div>
          ),
          variant: "default",
        });
        onComplete(game.id, numericScore);
      } else {
        toast({
          title: "Score Validation Issue",
          description: (
             <div>
              <p>AI thinks your score might be unusual.</p>
              <p className="text-sm text-muted-foreground mt-1">AI Reason: {result.reason}</p>
            </div>
          ),
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Could not validate or submit score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] flex flex-col ${isCompleted ? 'border-green-500 border-2 bg-green-500/10' : 'border-border'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-headline text-primary">
            <game.icon className="mr-3 h-7 w-7 text-accent" aria-hidden="true" />
            {game.name}
          </CardTitle>
          {isCompleted && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6 mr-1" />
              <span className="font-medium">Done!</span>
            </div>
          )}
        </div>
        <CardDescription className="pt-1 text-muted-foreground min-h-[3em]">{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <Button
          variant="outline"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => window.open(game.link, "_blank")}
          aria-label={`Play ${game.name} (opens in new tab)`}
        >
          Play Game
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>

        {!isCompleted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor={`score-${game.id}`} className="sr-only">Your Score for {game.name}</Label>
                    <FormControl>
                      <Input
                        id={`score-${game.id}`}
                        type="text" 
                        inputMode="decimal"
                        placeholder="Enter your score"
                        {...field}
                        className="text-base"
                        aria-describedby={`score-message-${game.id}`}
                      />
                    </FormControl>
                    <FormMessage id={`score-message-${game.id}`} />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || !currentUser} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : !currentUser ? (
                    "Sign in to Submit"
                ): (
                  "Submit Score"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          submittedScore !== null && submittedScore !== undefined && (
            <div className="text-center">
              <p className="text-lg font-medium">Your score: {submittedScore}</p>
              <p className="text-xs text-muted-foreground">Score saved to leaderboard.</p>
            </div>
          )
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground mt-auto">
        Average score: {game.averageScore}
      </CardFooter>
    </Card>
  );
}
