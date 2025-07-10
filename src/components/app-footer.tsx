"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Bug } from 'lucide-react';
import { FeedbackDialog } from './feedback-dialog';

export function AppFooter() {
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug'>('suggestion');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const openDialog = (type: 'suggestion' | 'bug') => {
        setFeedbackType(type);
        setIsFeedbackDialogOpen(true);
    };

    return (
        <>
            <footer className="text-center p-6 text-muted-foreground border-t">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>
                        © {currentYear ? currentYear : '...'} Daily Duel. Sharpen your mind, one game at a time.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button onClick={() => openDialog('suggestion')} variant="outline" size="sm">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Suggest a Feature or Game
                        </Button>
                         <Button onClick={() => openDialog('bug')} variant="outline" size="sm">
                            <Bug className="mr-2 h-4 w-4" />
                            Report a Bug
                        </Button>
                    </div>
                </div>
            </footer>
            <FeedbackDialog
                open={isFeedbackDialogOpen}
                onOpenChange={setIsFeedbackDialogOpen}
                defaultType={feedbackType}
            />
        </>
    );
}
