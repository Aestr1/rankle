
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Gamepad2, Users, BarChart3, Info, Loader2, Copy, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { PlayGroup, Game } from '@/types';
import { GAMES_DATA } from '@/lib/game-data';
import { GameCard } from '@/components/game-card';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { GroupLeaderboard } from '@/components/group-leaderboard';
import { useToast } from '@/hooks/use-toast';
import { deleteGroup, leaveGroup } from '@/ai/flows/manage-group-flow';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface GroupCompletedGameInfo {
  id: string; // game id
  score: number;
}

export default function IndividualGroupPage() {
  const [group, setGroup] = useState<PlayGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const [key, setKey] = useState(0); // Key to force-rerender leaderboard
  const { toast } = useToast();
  const [leaderboardType, setLeaderboardType] = useState<'overall' | 'daily'>('overall');

  const [completedGroupGames, setCompletedGroupGames] = useState<GroupCompletedGameInfo[]>([]);

  // State for confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete' | 'leave' | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  useEffect(() => {
    if (!groupId || authLoading) {
      return;
    }
    if (!currentUser) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    const groupDocRef = doc(db, "groups", groupId);

    const unsubscribe = onSnapshot(groupDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const groupData = docSnap.data() as Omit<PlayGroup, 'id'>;
        const gamesForGroup = GAMES_DATA.filter(gameData => groupData.gameIds.includes(gameData.id));
        setGroup({ 
            id: docSnap.id, 
            ...groupData, 
            selectedGamesDetails: gamesForGroup 
        });
      } else {
        setGroup(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching group details:", error);
        toast({
            title: "Access Denied",
            description: "You might not be a member of this group, or it may not exist.",
            variant: "destructive",
        });
        setGroup(null);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [groupId, currentUser, authLoading, toast]);

  const handleGroupGameComplete = useCallback((gameId: string, score: number) => {
    setCompletedGroupGames(prev => [...prev, { id: gameId, score }]);
    setKey(prevKey => prevKey + 1);
  }, []);

  const handleCopyCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.joinCode).then(() => {
        toast({
            title: "Copied to Clipboard!",
            description: `The join code "${group.joinCode}" is ready to be shared.`,
        });
    });
  };

  const openConfirmation = (action: 'delete' | 'leave') => {
    setConfirmAction(action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction || !currentUser || !group) return;

    setIsActionLoading(true);
    try {
      if (confirmAction === 'delete') {
        const result = await deleteGroup({ groupId: group.id, userId: currentUser.uid });
        if (result.success) {
          toast({ title: "Group Deleted", description: "The group has been permanently deleted." });
          router.push('/my-groups');
        } else {
          throw new Error(result.error);
        }
      } else if (confirmAction === 'leave') {
        const result = await leaveGroup({
          groupId: group.id,
          userId: currentUser.uid,
          userDisplayName: currentUser.displayName,
          userPhotoURL: currentUser.photoURL,
        });
        if (result.success) {
          toast({ title: "You've Left the Group", description: `You are no longer a member of "${group.name}".` });
          router.push('/my-groups');
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsActionLoading(false);
      setIsConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-xl text-muted-foreground">Loading group details...</p>
      </div>
    );
  }

  if (!currentUser) {
     return (
        <main className="flex-grow p-4 md:p-8 flex flex-col items-center justify-center">
            <Card className="w-full max-w-lg text-center shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center text-3xl font-headline text-primary">
                        <Info className="mr-3 h-8 w-8" />
                        Sign In Required
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground mb-6">
                        Please sign in to view your group details.
                    </p>
                </CardContent>
            </Card>
        </main>
     );
  }

  if (!group) {
    return (
      <main className="flex-grow p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-3xl font-headline text-destructive">
              <Info className="mr-3 h-8 w-8" />
              Group Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-6">
              The group you are looking for does not exist or you may not have permission to view it.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const gamesToDisplay = group.selectedGamesDetails || [];
  const isCreator = currentUser.uid === group.creatorId;

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'delete' ? 'Delete Group?' : 'Leave Group?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'delete'
                ? 'This action is irreversible. All group data, including scores, will be permanently deleted. Are you sure?'
                : 'You will be removed from this group and will no longer see its games or leaderboards. Are you sure?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)} disabled={isActionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} disabled={isActionLoading} className={cn(buttonVariants({ variant: "destructive" }))}>
              {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmAction === 'delete' ? 'Delete' : 'Leave'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="flex-grow p-4 md:p-8 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-headline text-accent">
                <Gamepad2 className="mr-3 h-7 w-7" />
                Today's Games for {group.name}
              </CardTitle>
              <CardDescription>Play the selected games for this group.</CardDescription>
            </CardHeader>
            <CardContent>
              {gamesToDisplay.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gamesToDisplay.map((game: Game) => {
                      const completedInfo = completedGroupGames.find(cg => cg.id === game.id);
                      return (
                          <GameCard
                            key={game.id}
                            game={game}
                            isCompleted={!!completedInfo}
                            submittedScore={completedInfo?.score}
                            onComplete={handleGroupGameComplete}
                            groupId={group.id}
                          />
                      );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No games have been selected for this group yet.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-headline text-accent">
                    <BarChart3 className="mr-3 h-7 w-7" />
                    Group Leaderboard
                  </CardTitle>
                  <CardDescription>Scores and ranks for group members.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Tabs defaultValue="overall" onValueChange={(value) => setLeaderboardType(value as 'overall' | 'daily')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overall">Overall</TabsTrigger>
                        <TabsTrigger value="daily">Today</TabsTrigger>
                    </TabsList>
                   </Tabs>
                   <GroupLeaderboard key={`${key}-${leaderboardType}`} groupId={group.id} type={leaderboardType} />
                </CardContent>
              </Card>

              <Card className="shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-headline text-accent">
                    <Users className="mr-3 h-7 w-7" />
                    Members ({group.members.length})
                  </CardTitle>
                   <div className="flex items-center text-sm pt-1">
                      <span className="text-muted-foreground">Join Code:</span>
                      <span className="font-mono bg-muted/80 px-1.5 py-0.5 rounded text-foreground/80 ml-2">{group.joinCode}</span>
                       <Button variant="ghost" size="icon" onClick={handleCopyCode} className="ml-1 h-7 w-7">
                          <span className="sr-only">Copy join code</span>
                          <Copy className="h-4 w-4" />
                      </Button>
                   </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {group.members.map(member => (
                      <li key={member.uid} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={member.photoURL || undefined} alt={member.displayName || 'Member'} />
                            <AvatarFallback>{member.displayName?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">{member.displayName || member.uid}</span>
                            {member.uid === group.creatorId && <span className="text-xs font-semibold text-accent">Creator</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                 <CardFooter>
                    {isCreator ? (
                        <Button variant="destructive" className="w-full" onClick={() => openConfirmation('delete')}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                        </Button>
                    ) : (
                        <Button variant="destructive" className="w-full" onClick={() => openConfirmation('leave')}>
                           <LogOut className="mr-2 h-4 w-4" /> Leave Group
                        </Button>
                    )}
                </CardFooter>
              </Card>
          </div>

        </main>
    </>
  );
}
