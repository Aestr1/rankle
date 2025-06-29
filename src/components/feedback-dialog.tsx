
"use client";

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from 'lucide-react';
import { submitFeedback, type SubmitFeedbackInput } from '@/ai/flows/submit-feedback-flow';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType: 'suggestion' | 'bug';
}

const feedbackSchema = z.object({
  type: z.enum(['suggestion', 'bug'], { required_error: "Please select a feedback type."}),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters long." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }).max(2000),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function FeedbackDialog({ open, onOpenChange, defaultType }: FeedbackDialogProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: defaultType,
      subject: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        type: defaultType,
        subject: "",
        description: "",
      });
      setIsSubmitting(false);
    }
  }, [open, defaultType, form]);

  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    setIsSubmitting(true);
    try {
        const input: SubmitFeedbackInput = {
            ...data,
            userId: currentUser?.uid,
        };

        const result = await submitFeedback(input);

        if (result.success) {
            toast({
                title: "Feedback Sent!",
                description: "Thank you for your help in making Rankle better.",
            });
            onOpenChange(false);
        } else {
            throw new Error(result.error || "An unknown error occurred.");
        }

    } catch (error) {
        console.error("Error submitting feedback:", error);
        toast({
            title: "Submission Failed",
            description: "Could not send your feedback. Please try again later.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            We appreciate your help in making Rankle better. All feedback is anonymous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="suggestion">Suggestion / Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Suggestion for a new game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={form.watch('type') === 'bug' ? "Please describe the bug, including steps to reproduce it." : "Please describe your suggestion in detail."}
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                    ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Feedback
                    </>
                    )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
