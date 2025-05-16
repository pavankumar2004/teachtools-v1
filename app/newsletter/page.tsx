import React from "react";
import { Main, Section, Container } from "@/components/craft";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { directory } from "@/directory.config";
import { Mail, Bell } from "lucide-react";

export const metadata = {
  title: `Newsletter | ${directory.name}`,
  description: "Subscribe to get updates on new AI tools for teachers.",
};

export default function NewsletterPage() {
  return (
    <Main>
      <Section className="py-12">
        <Container className="max-w-2xl">
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="inline-flex mx-auto items-center justify-center rounded-full bg-primary/10 p-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Stay Updated on New AI Tools
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                I'll send occasional updates when I add new tools that might help you in the classroom.
              </p>
            </div>
            
            <div className="bg-card rounded-xl border shadow-sm p-6 max-w-md mx-auto">
              <NewsletterSignup 
                title="Subscribe to Updates"
                description="No spam, just useful tools for teachers."
              />
              <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Unsubscribe anytime
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
