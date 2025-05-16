import React from "react";
import { Main, Section, Container } from "@/components/craft";
import { directory } from "@/directory.config";
import Balancer from "react-wrap-balancer";

export const metadata = {
  title: `About | ${directory.name}`,
  description: "Learn more about TeachTools.site and our mission to help educators leverage AI tools.",
};

export default function AboutPage() {
  return (
    <Main>
      <Section>
        <Container className="max-w-3xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">About TeachTools.site</h1>
              <p className="text-xl text-muted-foreground">
                <Balancer>
                  Our mission is to help educators discover and leverage AI tools that enhance teaching and learning.
                </Balancer>
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Purpose</h2>
              <p className="leading-7">
                TeachTools.site was created to address the growing need for educators to navigate the rapidly expanding landscape of AI tools. 
                We understand that teachers are busy and often don&apos;t have time to research and evaluate the numerous AI solutions available.
              </p>
              <p className="leading-7">
                Our platform serves as a curated directory of AI tools specifically selected for their relevance and usefulness in educational settings. 
                Each tool is categorized and described with educators in mind, highlighting features that matter most in the classroom.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">For Teachers, By Teachers</h2>
              <p className="leading-7">
                TeachTools.site is built by educators who understand the unique challenges and opportunities in modern classrooms. 
                Our team has experience across K-12 and higher education, giving us insight into the diverse needs of different educational environments.
              </p>
              <p className="leading-7">
                We personally test and evaluate each tool before adding it to our directory, considering factors like ease of use, 
                educational value, privacy features, and cost-effectiveness.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Select Tools</h2>
              <p className="leading-7">
                Our selection process focuses on tools that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enhance classroom engagement and student participation</li>
                <li>Streamline administrative tasks to save teachers time</li>
                <li>Personalize learning experiences for diverse student needs</li>
                <li>Provide meaningful assessment and feedback opportunities</li>
                <li>Respect student privacy and data security</li>
                <li>Offer reasonable pricing models for educational settings</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Join Our Community</h2>
              <p className="leading-7">
                TeachTools.site is more than just a directory—it&apos;s a growing community of forward-thinking educators. 
                By subscribing to our newsletter, you&apos;ll receive weekly updates on new tools, tips for implementing AI in your classroom, 
                and insights from other educators.
              </p>
              <p className="leading-7">
                Have a suggestion for a tool we should include? We welcome your input! Use our &quot;Submit a Tool&quot; page to share your discoveries with fellow educators.
              </p>
            </div>

            <div className="border-t pt-8">
              <p className="text-sm text-muted-foreground">
                TeachTools.site is maintained by pavan, an educator and technologist passionate about the intersection of AI and education.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
