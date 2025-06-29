
"use client";

import React, { useEffect } from 'react';
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

// IMPORTANT: Change this to your email address to receive feedback.
const RECIPIENT_EMAIL = "your-email@example.com";

export function FeedbackDialog({ open, onOpenChange, defaultType }: FeedbackDialogProps) {
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
    }
  }, [open, defaultType, form]);

  const onSubmit: SubmitHandler<FeedbackFormData> = (data) => {
    const mailtoSubject = `[Rankle ${data.type === 'bug' ? 'Bug Report' : 'Suggestion'}] ${data.subject}`;
    const mailtoBody = `Hello Rankle Team,

I'm submitting the following ${data.type}:
--------------------------------
${data.description}
--------------------------------

Thank you!`;
    
    const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody.trim())}`;
    
    window.location.href = mailtoLink;
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            We appreciate your help in making Rankle better. Please fill out the form below.
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
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing...
                    </>
                    ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Send via Email Client
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
