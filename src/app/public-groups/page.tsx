
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthButton } from '@/components/auth-button';
import { Trophy, Globe, Search, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { PlayGroup } from '@/types';
import { GroupCard } from '@/components/group-card';
import { AppFooter } from '@/components/app-footer';
import { getPublicGroups } from '@/ai/flows/manage-group-flow';
import { useDebounce } from '@/hooks/use-debounce';

export default function PublicGroupsPage() {
  const [allGroups, setAllGroups] = useState<PlayGroup[]>([]);
  const { currentUser, loading: authLoading } = useAuth();
  const [groupsLoading, setGroupsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'members' | 'newest'>('members');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchPublicGroups = useCallback(async () => {
    setGroupsLoading(true);
    try {
      const groups = await getPublicGroups({ searchTerm: debouncedSearchTerm, sortBy });
      setAllGroups(groups);
    } catch (error) {
      console.error("Error fetching public groups: ", error);
      // Optionally set an error state and show a toast
    } finally {
      setGroupsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy]);

  useEffect(() => {
    fetchPublicGroups();
  }, [fetchPublicGroups]);

  const renderContent = () => {
    if (groupsLoading) {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }

    if (allGroups.length === 0) {
      return (
        <Card className="shadow-lg mt-8">
          <CardContent className="p-8 text-center">
            <Info className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No public groups found.</p>
            <p className="text-sm mt-2">Try a different search, or be the first to create one!</p>
            <Button asChild className="mt-4">
              <Link href="/create-group">Create a Public Group</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
            ))}
        </div>
    );
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
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
              <Globe className="mr-3 h-8 w-8 text-accent" />
              Public Groups
            </CardTitle>
            <CardDescription>
              Browse and join public groups created by the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by group name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                    />
                </div>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'members' | 'newest')}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="members">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
        
        {renderContent()}

      </main>
      <AppFooter />
    </div>
  );
}
