import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export function AnalyticsSection() {
  return (
    <section id="analytics" aria-labelledby="analytics-title">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <BarChart2 className="mr-3 h-8 w-8 text-accent" />
            <span id="analytics-title">Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
            <BarChart2 className="h-16 w-16 mb-4 text-primary opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon!</h3>
            <p>Detailed graphs and insights into your gaming performance are on the way. Stay tuned!</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
