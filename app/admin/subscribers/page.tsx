import React from "react";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Main, Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Subscribers Admin | TeachTools.site",
};

// This ensures the page is not cached and always shows fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSubscribers() {
  try {
    const allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt));
    
    return allSubscribers;
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}

export default async function SubscribersAdminPage() {
  const subscribersList = await getSubscribers();

  return (
    <Main>
      <Section>
        <Container>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Email Subscribers</h1>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Total: {subscribersList.length} subscribers
                </p>
                <Button size="sm">Export CSV</Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>User Group</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribersList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No subscribers yet. Share your newsletter to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscribersList.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>{subscriber.source || "Direct"}</TableCell>
                        <TableCell>{subscriber.userGroup || "General"}</TableCell>
                        <TableCell>
                          {subscriber.isVerified ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(subscriber.createdAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Verify
                            </Button>
                            <Button variant="destructive" size="sm">
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
