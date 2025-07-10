import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex-grow p-4 md:p-8">
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="flex items-center text-3xl font-headline text-primary">
                <Info className="mr-3 h-8 w-8 text-accent" />
                <span id="about-title">About Daily Duel</span>
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
            <p>
                Welcome to Daily Duel! This is your personal hub to track your scores and compete with friends on popular daily puzzle games.
            </p>
            <p>
                <strong>How it works:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Click a "Play Game" button below to open a daily puzzle game on its official website.</li>
                <li>After you finish the game, look for a "Share" button to copy your results to the clipboard.</li>
                <li>Return to Daily Duel and use the "Paste" button on the game card to enter your score automatically.</li>
                <li>Click "Submit Score" to save your progress to your personal analytics and the leaderboards.</li>
            </ul>
            <p>
                The app currently operates on an honor system. Challenge yourself, track your progress, and see how you stack up against your friends!
            </p>
            </CardContent>
        </Card>
    </main>
  );
}
