import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/server/subscribe";

// Mark this route as dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

// Add CORS headers to allow requests from any origin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { email, source, userGroup } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Add the subscriber using our file-based system
    const subscriber = await addSubscriber(email, source, userGroup);
    
    // Check if this was a new subscription or existing one
    const isNewSubscription = new Date(subscriber.createdAt).getTime() === new Date(subscriber.updatedAt).getTime();
    
    if (!isNewSubscription) {
      // Email already exists
      return NextResponse.json(
        { success: true, id: subscriber.id, message: "Already subscribed" },
        { status: 200, headers: corsHeaders }
      );
    }

    // In a production app, you would send a verification email here
    console.log(`New subscriber added: ${email} with verification token: ${subscriber.verificationToken}`);

    return NextResponse.json(
      { 
        success: true, 
        id: subscriber.id,
        message: "Subscription successful! Please check your email to verify your subscription."
      }, 
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in subscribe API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
