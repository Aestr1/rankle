import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { GlobalLeaderboard } from "@/components/global-leaderboard";

export function LeaderboardSection() {
  return (
    <section id="leaderboard" aria-labelledby="leaderboard-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <Globe className="mr-3 h-8 w-8 text-accent" />
            <span id="leaderboard-title">Global Daily Leaderboard</span>
          </CardTitle>
          <CardDescription>
            See how you stack up against players worldwide in today's global challenge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalLeaderboard />
        </CardContent>
      </Card>
    </section>
  );
}
