"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { directory } from "@/directory.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Source and user group for tracking
const source = directory.baseUrl;
const userGroup = directory.name;

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterSignup({
  title = "Subscribe to our newsletter",
  description = "Get weekly updates on the latest AI tools for education.",
  className,
}: NewsletterSignupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          source: source,
          userGroup: userGroup,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      const data = await response.json();
      console.log("Submitted email:", values.email, "Contact ID:", data.id);
      setMessage(data.message || "Thank you for subscribing!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting email:", error);
      form.setError("email", {
        type: "manual",
        message: "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex max-w-md mx-auto gap-2">
                      <Input
                        placeholder="Your email address"
                        {...field}
                        className={cn(
                          "h-12 text-base",
                          isLoading && "opacity-50",
                        )}
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        className="h-12 px-6"
                        disabled={isLoading}
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-center">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
