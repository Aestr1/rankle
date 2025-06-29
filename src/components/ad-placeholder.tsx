
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone } from 'lucide-react';

export function AdPlaceholder() {
  return (
    <section id="ads">
        <Card className="border-dashed border-2 hover:border-primary transition-colors bg-muted/20">
            <CardContent className="p-4 text-center text-muted-foreground flex flex-col items-center justify-center h-48">
                <Megaphone className="w-10 h-10 mb-2 text-primary/50" />
                <p className="font-semibold text-lg">Advertisement</p>
                <p className="text-sm">Your ad unit would be displayed here.</p>
            </CardContent>
        </Card>
    </section>
  );
}
