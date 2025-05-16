import React from "react";
import { Main, Section, Container } from "@/components/craft";
import { directory } from "@/directory.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: `Submit a Tool | ${directory.name}`,
  description: "Suggest an AI tool for educators to be added to our directory.",
};

export default function SubmitPage() {
  return (
    <Main>
      <Section>
        <Container className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Submit an AI Tool</h1>
              <p className="text-xl text-muted-foreground">
                Help fellow educators discover valuable AI tools for the classroom
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tool Submission Form</CardTitle>
                <CardDescription>
                  Please provide details about the AI tool you'd like to recommend. Our team will review your submission and add it to the directory if it meets our criteria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="toolName">Tool Name*</Label>
                    <Input id="toolName" placeholder="e.g., ClassroomGPT" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="toolUrl">Website URL*</Label>
                    <Input id="toolUrl" type="url" placeholder="https://example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <select 
                      id="category" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="" disabled selected>Select a category</option>
                      <option value="assessment">Assessment & Grading</option>
                      <option value="lesson-planning">Lesson Planning</option>
                      <option value="content-creation">Content Creation</option>
                      <option value="student-engagement">Student Engagement</option>
                      <option value="tutoring">Tutoring & Adaptive Learning</option>
                      <option value="writing">Research & Writing Assistance</option>
                      <option value="language">Language Learning & Translation</option>
                      <option value="data">Data Analytics</option>
                      <option value="professional">Professional Development</option>
                      <option value="accessibility">Accessibility</option>
                      <option value="exam">Quiz & Exam Creation</option>
                      <option value="other">Other (please specify)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Please describe what this tool does and how it can benefit educators."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Your Experience with the Tool</Label>
                    <Textarea 
                      id="experience" 
                      placeholder="How have you used this tool in your teaching? What results have you seen?"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email*</Label>
                      <Input id="email" type="email" placeholder="jane@example.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role in Education</Label>
                    <Input id="role" placeholder="e.g., High School Science Teacher" />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit Tool</Button>
              </CardFooter>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium">1.</span>
                  <span>Our team will review your submission within 3-5 business days.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">2.</span>
                  <span>We'll test the tool to ensure it meets our quality standards for educators.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">3.</span>
                  <span>If approved, the tool will be added to our directory and featured in our newsletter.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">4.</span>
                  <span>We'll notify you by email when your submission is published.</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
