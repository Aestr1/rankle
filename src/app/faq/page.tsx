import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How does score parsing work?",
        answer: "When you paste your 'Share' text from a game, Daily Duel uses specific patterns to find your score. For Wordle, it looks for 'X/6'. For TimeGuessr, it finds your point total. If the format is unexpected, it might fail. Always paste the full, unaltered share text for best results."
    },
    {
        question: "What is a 'normalized' score?",
        answer: "Different games have different scoring systems (e.g., fewer guesses is better in Wordle, but more points is better in TimeGuessr). To compare scores fairly on leaderboards, Daily Duel converts every raw score into a standardized 0-100 scale, where 100 is always the best possible outcome."
    },
    {
        question: "Can I add a game to the library?",
        answer: "Currently, the game library is curated. However, we'd love to hear your suggestions! Use the 'Suggest a Feature or Game' button in the footer to let us know what you'd like to see added."
    },
    {
        question: "Is my data private?",
        answer: "Your individual gameplay data and analytics are private to you. When you play in a group, your display name and score for that day are visible to other group members on the group leaderboard. On the global leaderboard, only your display name and total daily score are shown."
    },
    {
        question: "Why can't I leave a group I created?",
        answer: "Group creators are responsible for the group. Instead of leaving, you must delete the group, which is a permanent action that removes it for all members. This prevents groups from becoming ownerless."
    }
]

export default function FaqPage() {
  return (
    <main className="container flex-grow p-4 md:p-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <HelpCircle className="mr-3 h-8 w-8 text-accent" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find answers to common questions about Daily Duel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
