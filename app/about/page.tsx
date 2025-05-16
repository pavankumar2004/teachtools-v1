import React from "react";
import { Main, Section, Container } from "@/components/craft";
import { directory } from "@/directory.config";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: `About | ${directory.name}`,
  description: "Learn more about TeachTools.site and our mission to help educators leverage AI tools.",
};

export default function AboutPage() {
  return (
    <Main>
      <Section>
        <Container className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">About TeachTools.site</h1>
              <p className="text-xl text-muted-foreground">
                <Balancer>
                  A simple directory to help teachers find useful AI tools
                </Balancer>
              </p>
            </div>

            <div className="space-y-4 bg-muted p-6 rounded-lg">
              <h2 className="text-2xl font-semibold">👋 Hi there!</h2>
              <p className="leading-7">
                I'm Pavan, a student who created this site to help my mom and other teachers find useful AI tools for their classrooms. 
                As a student, I've seen how teachers struggle to keep up with all the new AI tools coming out, so I wanted to make something simple that could help.
              </p>
              <p className="leading-7">
                TeachTools.site is just a straightforward directory where teachers can discover AI tools that might make their jobs easier and help their students learn better.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What You'll Find Here</h2>
              <p className="leading-7">
                This site includes tools that can help with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creating lesson plans and teaching materials</li>
                <li>Grading and assessment</li>
                <li>Student engagement activities</li>
                <li>Administrative tasks</li>
                <li>Personalized learning</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Help Make This Better</h2>
              <p className="leading-7">
                Know a great AI tool that teachers would love? Please share it! This project is meant to grow with input from real educators.
              </p>
              <div className="pt-2">
                <Link href="/submit">
                  <Button>Submit a Tool</Button>
                </Link>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Made with ❤️ by Pavan, a student who wants to help teachers around the world.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
