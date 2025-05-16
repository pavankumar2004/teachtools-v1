import React from "react";
import { Main, Section, Container } from "@/components/craft";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { directory } from "@/directory.config";
import { Button } from "@/components/ui/button";
import { Newspaper, Mail, Star, Clock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: `Newsletter | ${directory.name}`,
  description: "Subscribe to our newsletter for the latest AI tools and resources for educators.",
};

export default function NewsletterPage() {
  return (
    <Main>
      <Section className="py-12">
        <Container className="max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Join 5,000+ educators
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Stay Updated with TeachTools Weekly
              </h1>
              <p className="text-xl text-muted-foreground">
                Get the latest AI tools, resources, and tips delivered to your inbox every week.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Curated AI Tools</p>
                    <p className="text-sm text-muted-foreground">
                      Discover new AI tools specifically selected for education.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Implementation Guides</p>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step guides on how to use AI tools in your classroom.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Teacher Success Stories</p>
                    <p className="text-sm text-muted-foreground">
                      Real examples of how educators are using AI to transform learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <NewsletterSignup 
                title="Subscribe to TeachTools Weekly"
                description="Join our community of forward-thinking educators."
              />
              <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Sent every Wednesday morning
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  No spam, unsubscribe anytime
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
    
      
      <Section className="py-16">
        <Container className="max-w-3xl text-center">
          <div className="space-y-6">
            <div className="inline-flex mx-auto items-center justify-center rounded-full bg-primary/10 p-3">
              <Newspaper className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Ready to transform your teaching?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of educators who are using AI to enhance their teaching practice.
            </p>
            <div className="pt-4">
              <NewsletterSignup />
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
