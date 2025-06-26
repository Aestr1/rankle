"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export function AppFooter() {
    const [currentYear, setCurrentYear] = useState<number | null>(null);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const mailtoLink = `mailto:feedback@rankle.example.com?subject=Rankle Feature/Game Suggestion`;

    return (
        <footer className="text-center p-6 text-muted-foreground border-t">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>
                    © {currentYear ? currentYear : '...'} Rankle. Sharpen your mind, one game at a time.
                </p>
                <Button asChild variant="outline" size="sm">
                    <a href={mailtoLink}>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Suggest a Feature or Game
                    </a>
                </Button>
            </div>
        </footer>
    );
}
