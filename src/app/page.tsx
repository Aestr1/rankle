import { AboutSection } from "@/components/sections/about-section";
import { GamesSection } from "@/components/sections/games-section";
import { LeaderboardSection } from "@/components/sections/leaderboard-section";
import { AnalyticsSection } from "@/components/sections/analytics-section";
import { ShieldAlert } from "lucide-react"; // Using an icon for the app name

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 px-4 md:px-8 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <ShieldAlert className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-headline text-primary">Daily Duel</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-12">
        <AboutSection />
        <GamesSection />
        <LeaderboardSection />
        <AnalyticsSection />
      </main>
      <footer className="text-center p-6 text-muted-foreground border-t">
        © {new Date().getFullYear()} Daily Duel. Sharpen your mind, one game at a time.
      </footer>
    </div>
  );
}
