import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { email, source, userGroup } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email));

    if (existingSubscriber.length > 0) {
      // Email already exists, return success but don't create duplicate
      return NextResponse.json(
        { success: true, id: existingSubscriber[0].id, message: "Already subscribed" },
        { status: 200 }
      );
    }

    // Generate a verification token
    const verificationToken = uuidv4();

    // Insert the new subscriber
    const result = await db.insert(subscribers).values({
      email,
      source,
      userGroup,
      verificationToken,
      isVerified: false, // Requires verification via email
    }).returning({ id: subscribers.id });

    // In a production app, you would send a verification email here
    console.log(`New subscriber added: ${email} with verification token: ${verificationToken}`);

    return NextResponse.json(
      { 
        success: true, 
        id: result[0].id,
        message: "Subscription successful! Please check your email to verify your subscription."
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in subscribe API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
