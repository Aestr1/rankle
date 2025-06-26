import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <Info className="mr-3 h-8 w-8 text-accent" />
            <span id="about-title">About Rankle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <p>
            Welcome to Rankle! This is your personal hub to track your scores and compete with friends on popular daily puzzle games.
          </p>
          <p>
            <strong>How it works:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Browse the list of daily games.</li>
            <li>Click "Play Game" to open the game on its official website.</li>
            <li>After playing, enter your score in the input field on the game card here.</li>
            <li>Click "Submit" to save your score to your personal analytics and any group leaderboards.</li>
          </ul>
          <p>
            The app currently operates on an honor system. Challenge yourself, track your progress, and see how you stack up against your friends!
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
