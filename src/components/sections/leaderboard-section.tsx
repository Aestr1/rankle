import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function LeaderboardSection() {
  return (
    <section id="leaderboard" aria-labelledby="leaderboard-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <Users className="mr-3 h-8 w-8 text-accent" />
            <span id="leaderboard-title">Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
            <Users className="h-16 w-16 mb-4 text-primary opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Leaderboard Coming Soon!</h3>
            <p>Get ready to see how you rank against your friends. This feature is currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
