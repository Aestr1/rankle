
"use client";

import Link from 'next/link';
import type { PlayGroup } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCircle, BarChart3, CalendarDays, KeyRound, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface GroupCardProps {
  group: PlayGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  const memberDisplayLimit = 3;
  const displayedMembers = group.members?.slice(0, memberDisplayLimit) || [];
  const remainingMembersCount = (group.memberCount || group.members?.length || 0) - displayedMembers.length;

  // Firestore timestamps need to be converted with .toDate()
  const formattedDate = group.createdAt && typeof group.createdAt.toDate === 'function' 
    ? format(group.createdAt.toDate(), 'MMM d, yyyy') 
    : 'N/A';

  return (
    <Link 
      href={`/my-groups/${group.id}`} 
      className="block outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 h-full flex flex-col cursor-pointer bg-card hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-start justify-between text-2xl font-headline text-primary">
            <span className="flex items-center">
              <Users className="mr-3 h-7 w-7 text-accent flex-shrink-0" />
              {group.name}
            </span>
            {group.isPublic && (
              <Badge variant="secondary">
                  <Globe className="mr-1.5 h-3.5 w-3.5" />
                  Public
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="flex items-center text-sm pt-1">
            <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            Created by {group.creatorName || 'a user'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1 text-foreground/90">Members ({group.memberCount || group.members.length})</h4>
            <div className="text-xs text-muted-foreground space-y-0.5">
              {displayedMembers.length > 0 ? displayedMembers.map(member => (
                <p key={member.uid} className="truncate">{member.displayName || member.uid}</p>
              )) : (
                 <p className="italic">No members yet.</p>
              )}
              {remainingMembersCount > 0 && (
                <p className="italic">...and {remainingMembersCount} more</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
              <KeyRound className="mr-2 h-3.5 w-3.5" />
              Join Code: <span className="font-mono bg-muted/80 px-1 py-0.5 rounded text-foreground/80 ml-1">{group.joinCode}</span>
          </div>

          <div className="border-t pt-3">
            <h4 className="font-semibold text-sm mb-1 text-foreground/90">Games Included</h4>
            <p className="text-xs text-muted-foreground">
              {group.gameIds.length} game{group.gameIds.length === 1 ? '' : 's'} in rotation.
            </p>
          </div>
          
        </CardContent>
        <CardFooter className="flex-col items-start text-xs text-muted-foreground space-y-2 pt-4">
          <div className="flex items-center w-full">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>View Leaderboard and Details</span>
          </div>
          <div className="flex items-center w-full">
             <CalendarDays className="mr-2 h-4 w-4" />
            Created: {formattedDate}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
