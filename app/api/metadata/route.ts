import { NextResponse, NextRequest } from "next/server";
import { load } from "cheerio";
import { URL } from 'url';

declare global {
  var $: typeof load;
  interface Window {
    $: typeof load;
  }
}

// This is a server-side only API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers });
    }

    // Extract URL from request
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400, headers });
    }

    // Validate and normalize URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      // Add https if no protocol is specified
      if (!validUrl.protocol || validUrl.protocol === ":") {
        validUrl = new URL(`https://${url}`);
      }
    } catch (error) {
      console.error("Invalid URL format:", error);
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400, headers }
      );
    }

    console.log("Fetching metadata for URL:", validUrl.toString());

    // Try to fetch with a longer timeout (20 seconds)
    try {
      const response = await fetch(validUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DirectoryBot/1.0; +http://localhost)",
        },
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(20000), // 20 second timeout
      });

      if (!response.ok) {
        console.log(`Failed to fetch URL: ${response.statusText}`);
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.statusText}` },
          { status: response.status, headers },
        );
      }

      const html = await response.text();
      const $ = load(html);

      // Get favicon
      let faviconUrl =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="apple-touch-icon"]').attr("href") ||
        "/favicon.ico"; // Default fallback

      // If favicon is relative, make it absolute
      if (faviconUrl && !faviconUrl.startsWith("http")) {
        try {
          faviconUrl = new URL(faviconUrl, validUrl.origin).toString();
        } catch (e) {
          console.warn("Failed to parse favicon URL:", e);
          faviconUrl = "/favicon.ico";
        }
      }

      // Get Open Graph image
      let ogImage =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        ""; // Provide default empty string

      // Make ogImage URL absolute if it's relative
      if (ogImage && !ogImage.startsWith("http")) {
        try {
          ogImage = new URL(ogImage, validUrl.origin).toString();
        } catch (e) {
          console.warn("Failed to parse ogImage URL:", e);
          ogImage = "";
        }
      }

      // Get title and description
      const pageTitle =
        $('meta[property="og:title"]').attr("content") ||
        $("title").text().trim() ||
        validUrl.hostname;

      const pageDescription =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";

      const pageMetadata = {
        favicon: faviconUrl,
        ogImage,
        title: pageTitle,
        description: pageDescription,
        url: validUrl.toString(),
      };

      console.log("Generated metadata:", pageMetadata);

      return NextResponse.json(pageMetadata, { headers });
    } catch (fetchError) {
      // If the fetch fails with a timeout or other error, create basic metadata from the URL
      console.error("Error fetching URL:", fetchError);
      
      // Create basic metadata from the URL
      const basicMetadata = {
        favicon: "/favicon.ico",
        ogImage: "",
        title: validUrl.hostname,
        description: `Content from ${validUrl.hostname}`,
        url: validUrl.toString(),
        isBasicMetadata: true,
      };
      
      console.log("Generated basic metadata due to fetch error:", basicMetadata);
      
      // Return the basic metadata with a 200 status to prevent cascading failures
      return NextResponse.json(basicMetadata, { headers });
    }
  } catch (error) {
    const statusCode = error instanceof Error ? 500 : (error as { statusCode?: number }).statusCode || 500;
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching metadata:", errorMessage);
    
    return NextResponse.json(
      { error: `Failed to fetch or parse metadata: ${errorMessage}` },
      { status: statusCode, headers }
    );
  }
}
