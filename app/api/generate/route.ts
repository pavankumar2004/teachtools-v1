import { NextResponse } from "next/server";

// Mark this route as dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

// Define headers outside the function to make them available throughout the route handler
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function POST(request: Request) {
  try {

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }
    
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const { url, searchResults } = body;

    if (!url || !searchResults) {
      return NextResponse.json(
        { error: "URL and search results are required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Parse and format search results for better context
    let parsedResults;
    try {
      parsedResults = JSON.parse(searchResults);
    } catch (error) {
      console.warn("Failed to parse search results:", error);
      parsedResults = searchResults; // Use as is if already parsed
    }

    const prompt = `You are a helpful assistant that writes clear, concise summaries of web content.
    Based on the search results and content from ${url}, write a brief but comprehensive overview.

    Focus on:
    - The main purpose or value proposition
    - Key features or main points
    - Target audience or use cases
    - What makes it unique or noteworthy

    Format the response in markdown and keep it under 200 words. Make it engaging and informative.

    Context from the webpage:
    ${JSON.stringify(parsedResults, null, 2)}`;

    // Use Google's Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCnI4g5CXES-WDiqUkDpmoiRgYaJpPsAZM';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    let text = '';
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && 
        data.candidates[0].content.parts[0].text) {
      text = data.candidates[0].content.parts[0].text;
    }

    return NextResponse.json({ overview: text }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating overview:", errorMessage);
    return NextResponse.json(
      { error: `Failed to generate overview: ${errorMessage}` },
      { status: 500, headers: corsHeaders },
    );
  }
}
