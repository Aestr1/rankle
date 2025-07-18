
"use client";

import type { Game, Gameplay } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, ExternalLink, Loader2, Info, ClipboardPaste, Star, ShieldAlert } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-context";
import { addGameplay } from "@/lib/gameplay";
import { normalizeScore } from "@/lib/scoring";
import { parseRawScore } from "@/lib/score-parser";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
  isCompleted: boolean;
  onComplete: (gameId: string, score: number) => void;
  submittedScore?: number | null;
  groupId: string | null;
}

const scoreSchema = z.object({
  score: z.string().min(1, {
    message: "Please enter or paste your score.",
  }),
});
type ScoreFormData = z.infer<typeof scoreSchema>;

export function GameCard({ game, isCompleted, onComplete, submittedScore, groupId }: GameCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const form = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      score: "", // Always start fresh
    },
  });
  
  const isScoringImplemented = game.scoringStatus === 'implemented';

  const handlePaste = async () => {
    if (!navigator.clipboard?.readText) {
      toast({
        title: "Paste Not Supported",
        description: "Your browser does not support pasting from the clipboard. Please paste manually.",
        variant: "destructive",
      });
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      form.setValue('score', text, { shouldValidate: true });
      toast({
        title: "Pasted from clipboard!",
        description: "Your score is ready to be submitted.",
      });
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        title: "Paste Failed",
        description: "Could not read clipboard. Please ensure you have granted permission.",
        variant: "destructive",
      });
    }
  };

  const onSubmit: SubmitHandler<ScoreFormData> = async (data) => {
    if (!currentUser || !isScoringImplemented) return;
    setIsSubmitting(true);
    
    // If it's the featured game, we don't normalize or save to the leaderboard.
    if (game.isFeatured) {
        toast({
            title: "Thanks for playing!",
            description: `Score submitted for the featured game: ${game.name}.`,
        });
        onComplete(game.id, 0); // Pass a dummy score to trigger UI update
        setIsSubmitting(false);
        form.reset();
        return;
    }
    
    const rawScore = parseRawScore(game.id, data.score);

    if (rawScore === null) {
      setIsAlertOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const normalizedScore = normalizeScore(game.id, rawScore);
      
      const gameplayData: Omit<Gameplay, 'id' | 'playedAt'> = {
          userId: currentUser.uid,
          userDisplayName: currentUser.displayName || "Anonymous",
          userPhotoURL: currentUser.photoURL || null,
          gameId: game.id,
          groupId: groupId,
          score: normalizedScore,
      };

      await addGameplay(gameplayData);
      
      toast({
        title: "Score Submitted!",
        description: `Your normalized score of ${normalizedScore}/100 for ${game.name} has been saved.`,
        variant: "default",
      });
      onComplete(game.id, normalizedScore);
      form.reset();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Could not submit score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardBorderClass = game.isFeatured
    ? 'border-amber-500 border-2 bg-amber-500/10'
    : isCompleted
    ? 'border-green-500 border-2 bg-green-500/10'
    : 'border-border';

  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-destructive" />
              Invalid Score Format
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 py-2">
                <p>Could not understand the score for {game.name}. Please paste the full 'Share' text from the game, including the title and emoji grid.</p>
                {game.exampleShareText && (
                  <>
                  <p className="font-semibold">For example:</p>
                  <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap">
                    <code>{game.exampleShareText}</code>
                  </pre>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className={`shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] flex flex-col h-full ${cardBorderClass}`}>
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
                      <div className="relative">
                        <FormControl>
                          {game.scoreInputType === 'text' ? (
                              <Textarea
                                id={`score-${game.id}`}
                                placeholder="Paste share text here..."
                                className="text-sm resize-none pr-12"
                                rows={4}
                                {...field}
                                aria-describedby={`score-message-${game.id}`}
                                autoComplete="off"
                                disabled={!isScoringImplemented}
                              />
                          ) : (
                              <Input
                                id={`score-${game.id}`}
                                type="text" 
                                inputMode="decimal"
                                placeholder="Enter score here..."
                                {...field}
                                className="text-base pr-12"
                                aria-describedby={`score-message-${game.id}`}
                                autoComplete="off"
                                disabled={!isScoringImplemented}
                              />
                          )}
                        </FormControl>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handlePaste}
                            className="absolute top-1 right-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label="Paste score from clipboard"
                            disabled={!isScoringImplemented}
                          >
                            <ClipboardPaste className="h-5 w-5" />
                          </Button>
                      </div>
                      <FormMessage id={`score-message-${game.id}`} />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting || !currentUser || !isScoringImplemented} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : !currentUser ? (
                      "Sign in to Submit"
                  ) : !isScoringImplemented ? (
                    <>
                      <ShieldAlert className="mr-2 h-4 w-4"/>
                      Scoring Coming Soon
                    </>
                  ) : (
                    "Submit Score"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <>
              {game.isFeatured ? (
                 <div className="text-center">
                  <p className="text-lg font-medium">Thanks for playing!</p>
                  <p className="text-xs text-muted-foreground">Featured game completed.</p>
                </div>
              ) : (
                submittedScore !== null && submittedScore !== undefined && (
                  <div className="text-center">
                    <p className="text-lg font-medium">Your score: {submittedScore} / 100</p>
                    <p className="text-xs text-muted-foreground">Normalized score saved.</p>
                  </div>
                )
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground mt-auto flex items-center justify-between">
            {game.isFeatured && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                    <Star className="w-3 h-3 mr-1.5" />
                    Game of the Day
                </Badge>
            )}
            {!isScoringImplemented && !game.isFeatured && (
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                    <ShieldAlert className="w-3 h-3 mr-1.5" />
                    Alpha
                </Badge>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
