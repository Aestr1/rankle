
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BarChart2, ArrowRight } from "lucide-react";

export function AnalyticsSection() {
  return (
    <section id="analytics" aria-labelledby="analytics-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <BarChart2 className="mr-3 h-8 w-8 text-accent" />
            <span id="analytics-title">Your Progress</span>
          </CardTitle>
          <CardDescription>
            Track your performance across all games with detailed charts and statistics.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center p-8">
            <BarChart2 className="h-16 w-16 mb-4 text-primary opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Dive into Your Data</h3>
            <p className="text-muted-foreground mb-6">View your personal analytics page to see your scores and progress over time.</p>
             <Button asChild size="lg">
              <Link href="/analytics">
                View My Analytics <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
        </CardContent>
      </Card>
    </section>
  );
}
