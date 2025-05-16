"use server";

import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { generateSlug } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Exa from "exa-js";

export type ActionState = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: any;
  progress?: {
    current: number;
    total: number;
    currentUrl?: string;
    lastAdded?: string;
  };
};

type BookmarkData = {
  title: string;
  description: string;
  url: string;
  overview: string;
  search_results: string;
  favicon: string;
  ogImage: string;
  slug: string;
  categoryId: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GeneratedContent = {
  title: string;
  description: string;
  url: string;
  overview: string;
  search_results: string;
  favicon: string;
  ogImage: string;
  slug: string;
  error?: string;
};

// Category Actions
export async function createCategory(
  prevState: ActionState | null,
  formData: {
    name: string;
    description: string;
    slug: string;
    color: string;
    icon: string;
  },
): Promise<ActionState> {
  try {
    const name = formData.name;
    const description = formData.description;
    const slug = formData.slug;
    const color = formData.color;
    const icon = formData.icon;
    const id = slug; // Using slug as the ID since it's unique

    await db.insert(categories).values({
      id,
      name,
      description,
      slug,
      color,
      icon,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error creating category:", err);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(
  prevState: ActionState | null,
  formData: {
    id: string;
    name: string;
    description: string;
    slug: string;
    color: string;
    icon: string;
  },
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.id;
    if (!id) {
      return { error: "No category ID provided" };
    }

    const name = formData.name;
    const description = formData.description;
    const slug = formData.slug;
    const color = formData.color;
    const icon = formData.icon;

    await db
      .update(categories)
      .set({
        name,
        description,
        slug,
        color,
        icon,
      })
      .where(eq(categories.id, id));

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error updating category:", err);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(
  prevState: ActionState | null,
  formData: {
    id: string;
  },
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.id;
    if (!id) {
      return { error: "No category ID provided" };
    }

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { error: "Failed to delete category" };
  }
}

// Bookmark Actions
export async function createBookmark(
  prevState: ActionState | null,
  formData: {
    title: string;
    description: string;
    url: string;
    slug: string;
    overview: string;
    favicon: string;
    ogImage: string;
    search_results: string;
    categoryId: string;
    isFavorite: string;
    isArchived: string;
  },
): Promise<ActionState> {
  try {
    const title = formData.title;
    const description = formData.description;
    const url = formData.url;
    let slug = formData.slug;
    const overview = formData.overview;
    const favicon = formData.favicon;
    const ogImage = formData.ogImage;
    const search_results = formData.search_results;
    const categoryId = formData.categoryId;
    const isFavorite = formData.isFavorite === "true";
    const isArchived = formData.isArchived === "true";

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    await db.insert(bookmarks).values({
      title,
      slug,
      url,
      description,
      categoryId: categoryId === "none" ? null : categoryId,
      search_results: search_results || null,
      isFavorite,
      isArchived,
      overview,
      favicon,
      ogImage,
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error creating bookmark:", err);
    return { error: "Failed to create bookmark" };
  }
}

export async function updateBookmark(
  prevState: ActionState | null,
  formData: {
    id: string;
    title: string;
    description: string;
    url: string;
    slug: string;
    overview: string;
    favicon: string;
    ogImage: string;
    search_results: string;
    categoryId: string;
    isFavorite: string;
    isArchived: string;
  },
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.id;
    if (!id) {
      return { error: "No bookmark ID provided" };
    }

    const title = formData.title;
    const description = formData.description;
    const url = formData.url;
    let slug = formData.slug;
    const overview = formData.overview;
    const favicon = formData.favicon;
    const ogImage = formData.ogImage;
    const search_results = formData.search_results;
    const categoryId = formData.categoryId;
    const isFavorite = formData.isFavorite === "true";
    const isArchived = formData.isArchived === "true";

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    await db
      .update(bookmarks)
      .set({
        title,
        slug,
        url,
        description,
        categoryId: categoryId === "none" ? null : categoryId,
        search_results: search_results || null,
        overview,
        favicon,
        ogImage,
        isFavorite,
        isArchived,
      })
      .where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error updating bookmark:", err);
    return { error: "Failed to update bookmark" };
  }
}

export async function deleteBookmark(
  prevState: ActionState | null,
  formData: {
    id: string;
    url: string;
  },
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.id;
    if (!id) {
      return { error: "No bookmark ID provided" };
    }

    const url = formData.url;

    await db.delete(bookmarks).where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/${encodeURIComponent(url)}`);

    return { success: true };
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    return { error: "Failed to delete bookmark" };
  }
}

// Helper function to handle errors
type ErrorResponse = {
  message: string;
  status: number;
};

export async function handleError(
  error: Error | ErrorResponse,
): Promise<{ message: string }> {
  if (error instanceof Error) {
    return { message: error.message };
  } else {
    return { message: error.message };
  }
}

export async function bulkUploadBookmarks(
  prevState: ActionState | null,
  formData: {
    urls: string;
    categoryId?: string;
  },
): Promise<ActionState> {
  console.log("======= BULK UPLOAD STARTED =======");
  try {
    console.log("Received formData:", JSON.stringify(formData, null, 2));
    
    const urls = formData.urls;
    if (!urls) {
      console.log("ERROR: No URLs provided in formData");
      return { error: "No URLs provided" };
    }

    // Get categoryId, defaulting to null
    const categoryId = formData.categoryId && formData.categoryId !== "none" 
      ? formData.categoryId 
      : null;

    console.log(`Processing URLs string of length: ${urls.length} characters`);
    console.log(`Using category ID: ${categoryId || 'none (null)'}`);
    
    const urlList = urls.split("\n").filter((url) => url.trim());
    console.log(`Found ${urlList.length} URLs to process after filtering:`);
    urlList.forEach((url, index) => {
      console.log(`  [${index + 1}] ${url}`);
    });
    
    let successCount = 0;
    let errorCount = 0;
    let lastAddedTitle = "";
    let errors: string[] = [];

    // Process URLs with a timeout to avoid hanging on problematic URLs
    const processUrlWithTimeout = async (url: string, timeout: number = 30000) => {
      return new Promise<void>(async (resolve) => {
        // Set a timeout to ensure we don't hang on any URL
        const timeoutId = setTimeout(() => {
          console.log(`[URL] Timed out after ${timeout/1000}s: ${url}`);
          
          // Create a basic bookmark even when timing out
          try {
            const basicBookmark: BookmarkData = {
              title: url.replace(/https?:\/\/(www\.)?/, ""), // Basic title from URL
              description: "Added via bulk upload (timed out during processing)",
              url: url,
              overview: "",
              search_results: "",
              favicon: "",
              ogImage: "",
              slug: generateSlug(url.replace(/https?:\/\/(www\.)?/, "")),
              categoryId: categoryId,
              isFavorite: false,
              isArchived: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            db.insert(bookmarks).values(basicBookmark)
              .then(() => {
                successCount++;
                lastAddedTitle = basicBookmark.title;
                console.log(`[URL] Created basic bookmark after timeout: ${basicBookmark.title}`);
                revalidatePath("/admin");
                revalidatePath("/[slug]");
              })
              .catch((err) => {
                errorCount++;
                const errorMessage = err instanceof Error ? err.message : String(err);
                errors.push(`${url}: Failed to create basic bookmark: ${errorMessage}`);
                console.log(`[URL] Failed to create basic bookmark after timeout: ${errorMessage}`);
              });
          } catch (error) {
            errorCount++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(`${url}: ${errorMessage}`);
            console.log(`[URL] Error creating basic bookmark: ${errorMessage}`);
          }
          
          resolve();
        }, timeout);
        
        try {
          // Normalize URL before processing
          let normalizedUrl = url;
          if (!normalizedUrl.match(/^https?:\/\//i)) {
            normalizedUrl = `https://${normalizedUrl}`;
            console.log(`[URL] Normalized URL to: ${normalizedUrl}`);
          }
          
          // Process the URL
          const content = await generateContent(normalizedUrl);
          
          // Clear the timeout since we completed successfully
          clearTimeout(timeoutId);
          
          if (content.error) {
            console.log(`[URL] Error from generateContent: ${content.error}`);
            
            // Try to create a basic bookmark even if content generation failed
            if (content.title) {
              // We have some basic metadata, so create a bookmark with what we have
              const basicBookmark: BookmarkData = {
                title: content.title || normalizedUrl,
                description: content.description || "Added via bulk upload (partial content)",
                url: content.url || normalizedUrl,
                overview: "",
                search_results: "",
                favicon: content.favicon || "",
                ogImage: content.ogImage || "",
                slug: content.slug || generateSlug(normalizedUrl.replace(/https?:\/\/(www\.)?/, "")),
                categoryId: categoryId,
                isFavorite: false,
                isArchived: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              
              await db.insert(bookmarks).values(basicBookmark);
              successCount++;
              lastAddedTitle = basicBookmark.title;
              console.log(`[URL] Created basic bookmark with partial data: ${basicBookmark.title}`);
              revalidatePath("/admin");
              revalidatePath("/[slug]");
              resolve();
              return;
            }
            
            // No usable data, record as error
            errorCount++;
            errors.push(`${url}: ${content.error}`);
            resolve();
            return;
          }

          // If we have at least a title, consider it successful even with partial content
          if (content.title) {
            // Create bookmark data
            const bookmarkData: BookmarkData = {
              title: content.title,
              description: content.description,
              url: content.url || normalizedUrl,
              overview: content.overview,
              search_results: content.search_results,
              favicon: content.favicon,
              ogImage: content.ogImage,
              slug: content.slug,
              categoryId: categoryId,
              isFavorite: false,
              isArchived: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            await db.insert(bookmarks).values(bookmarkData);
            successCount++;
            lastAddedTitle = content.title;
            
            console.log(`[URL] Successfully added: "${content.title}"`);
            revalidatePath("/admin");
            revalidatePath("/[slug]");
          } else {
            // If we don't have a title, consider it an error
            errorCount++;
            errors.push(`${url}: Failed to extract content (no title found)`);
            console.log(`[URL] Failed to extract content (no title found): ${url}`);
          }
        } catch (error) {
          // Clear the timeout since we completed with an error
          clearTimeout(timeoutId);
          
          // Try to create a basic bookmark even if there was an error
          try {
            const basicTitle = url.replace(/https?:\/\/(www\.)?/, "");
            const basicBookmark: BookmarkData = {
              title: basicTitle,
              description: "Added via bulk upload (error during processing)",
              url: url,
              overview: "",
              search_results: "",
              favicon: "",
              ogImage: "",
              slug: generateSlug(basicTitle),
              categoryId: categoryId,
              isFavorite: false,
              isArchived: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            await db.insert(bookmarks).values(basicBookmark);
            successCount++;
            lastAddedTitle = basicBookmark.title;
            console.log(`[URL] Created fallback bookmark after error: ${basicBookmark.title}`);
            revalidatePath("/admin");
            revalidatePath("/[slug]");
          } catch (secondError) {
            errorCount++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(`${url}: ${errorMessage}`);
            console.log(`[URL] ERROR: ${errorMessage}`);
            console.error(`[URL] Full error:`, error);
          }
        }
        
        resolve();
      });
    };

    // Process URLs sequentially to avoid overwhelming the server
    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i].trim();
      if (!url) {
        console.log(`[URL ${i+1}] Skipping empty URL at index ${i}`);
        continue;
      }

      console.log(`\n[URL ${i+1}/${urlList.length}] Starting to process: ${url}`);
      await processUrlWithTimeout(url);
      
      // Add a small delay between processing URLs to avoid rate limits
      if (i < urlList.length - 1) {
        console.log(`[URL] Adding delay before processing next URL`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const resultMessage = `Successfully imported ${successCount} bookmarks. ${errorCount > 0 ? `Failed to import ${errorCount} URLs.` : ""}`;
    console.log(`\n===== BULK UPLOAD COMPLETED =====`);
    console.log(`Success: ${successCount}, Errors: ${errorCount}`);
    console.log(`Result message: ${resultMessage}`);
    if (errors.length > 0) {
      console.log(`Errors encountered:`);
      errors.forEach((err, idx) => console.log(`  [${idx + 1}] ${err}`));
    }
    
    return {
      success: true,
      message: resultMessage,
      progress: {
        current: urlList.length,
        total: urlList.length,
        lastAdded: lastAddedTitle,
      },
      data: errors.length > 0 ? { errors } : undefined
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`===== BULK UPLOAD FAILED =====`);
    console.log(`Error message: ${errorMessage}`);
    console.error(`Error details:`, error);
    return {
      success: false,
      error: errorMessage || "Failed to process bulk upload",
    };
  }
}

// URL Scraping Action
export async function scrapeUrl(
  prevState: ActionState | null,
  formData: {
    url: string;
  },
): Promise<ActionState> {
  try {
    const url = formData.url;
    if (!url) return { error: "URL is required" };

    // Get metadata from our API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "";

    const metadataUrl = `${baseUrl}/api/metadata?url=${encodeURIComponent(url)}`;
    console.log(`[getMetadata] Fetching from: ${metadataUrl}`);
    
    const metadataResponse = await fetch(
      metadataUrl,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store", // Prevent caching
      },
    );

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error(`[getMetadata] Error response: ${errorText.substring(0, 200)}...`);
      throw new Error(`Failed to fetch metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
    }

    // Try to safely parse the JSON response
    let metadata;
    try {
      const responseText = await metadataResponse.text();
      console.log(`[getMetadata] Response text (first 100 chars): ${responseText.substring(0, 100)}...`);
      metadata = JSON.parse(responseText);
    } catch (error) {
      console.error(`[getMetadata] Error parsing JSON:`, error);
      throw new Error(`Failed to parse metadata response: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Get search results using Exa API
    const exaResponse = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXASEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        query: url,
        num_results: 5,
      }),
    });

    if (!exaResponse.ok) {
      throw new Error("Failed to fetch search results from Exa");
    }

    const searchResults = await exaResponse.json();

    return {
      success: true,
      data: {
        title: metadata.title || "",
        description: metadata.description || "",
        favicon: metadata.favicon || "",
        ogImage: metadata.ogImage || "",
        url: metadata.url || url,
        search_results: JSON.stringify(searchResults),
      },
    };
  } catch (error) {
    console.error("Error scraping URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape URL",
    };
  }
}

export async function generateContent(url: string): Promise<GeneratedContent> {
  try {
    if (!url) {
      throw new Error("URL is required");

    }

    console.log(`[generateContent] Processing URL: ${url}`);

    // We need to provide a full URL including origin for fetch to work properly in server actions
    // Get current URL origin or use a default
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "";
    
    const metadataUrl = `${baseUrl}/api/metadata?url=${encodeURIComponent(url)}`;

    console.log(`[generateContent] Fetching metadata from: ${metadataUrl}`);

    // First, fetch metadata from our API
    const metadataResponse = await fetch(metadataUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0", // sometimes required by some APIs
      },
      cache: "no-store", // Prevent caching - don't use revalidate at the same time
    });

    if (!metadataResponse.ok) {
      console.log(`[generateContent] Metadata response not OK. Status: ${metadataResponse.status}`);
      // Try to read the response as text first to see what we're actually getting
      const responseText = await metadataResponse.text();
      console.log(`[generateContent] Raw response: ${responseText.substring(0, 1000)}...`);
      
      // If it starts with "<", it's probably HTML, not JSON
      if (responseText.trim().startsWith("<")) {
        throw new Error(`Received HTML instead of JSON from metadata API. The API endpoint may be returning an error page.`);
      }
      
      // Otherwise, try to parse it as JSON if it looks like JSON
      let errorData = {};
      if (responseText.trim().startsWith("{")) {
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error(`[generateContent] Failed to parse error response:`, e);
        }
      }
      
      throw new Error(
        (errorData as any).error || 
        `Failed to fetch metadata. Status: ${metadataResponse.status}`
      );
    }

    // Try to safely parse the JSON response
    let metadata;
    try {
      const responseText = await metadataResponse.text();
      console.log(`[generateContent] Metadata response text (first 100 chars): ${responseText.substring(0, 1000)}...`);
      metadata = JSON.parse(responseText);
    } catch (error) {
      console.error(`[generateContent] Error parsing metadata JSON:`, error);
      throw new Error(`Failed to parse metadata response: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log(`[generateContent] Successfully parsed metadata:`, metadata);

    // Basic fallback for required fields
    const pageTitle = metadata.title || url;
    const pageDescription = metadata.description || "";

    try {
      // Get search results using Exa
      console.log(`[generateContent] Getting content from Exa for: ${url}`);
      const exa = new Exa(process.env.EXASEARCH_API_KEY as string);
      const searchResults = await exa.getContents([url], {
        text: true,
        livecrawl: "fallback",
      });

      console.log(`[generateContent] Exa search results retrieved`);

      // Generate overview using Claude
      console.log(`[generateContent] Generating overview using API`);
      // Use the same baseUrl for the generate API
      const overviewResponse = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          searchResults: JSON.stringify(searchResults),
        }),
      });

      if (!overviewResponse.ok) {
        console.log(`[generateContent] Overview generation failed. Status: ${overviewResponse.status}`);
        throw new Error(`Failed to generate overview. Status: ${overviewResponse.status}`);
      }

      // Safely parse the overview response
      let overviewData;
      try {
        const responseText = await overviewResponse.text();
        overviewData = JSON.parse(responseText);
      } catch (error) {
        console.error(`[generateContent] Error parsing overview response:`, error);
        throw new Error(`Failed to parse overview response: ${error instanceof Error ? error.message : String(error)}`);
      }

      console.log(`[generateContent] Overview generated successfully`);

      // Generate a slug from the title
      const slug = generateSlug(pageTitle);

      return {
        title: pageTitle,
        description: pageDescription,
        url: metadata.url || url,
        overview: overviewData.overview || "",
        search_results: JSON.stringify(searchResults),
        favicon: metadata.favicon || "",
        ogImage: metadata.ogImage || "",
        slug: slug,
      };
    } catch (error) {
      console.error(`[generateContent] Error in content generation:`, error);
      
      // Even if we fail at getting additional content, return a basic bookmark with the metadata we have
      return {
        title: pageTitle,
        description: pageDescription,
        url: url,
        overview: "",
        search_results: "",
        favicon: metadata.favicon || "",
        ogImage: metadata.ogImage || "",
        slug: generateSlug(pageTitle),
        error: error instanceof Error ? error.message : "Failed to generate complete content",
      };
    }
  } catch (error) {
    console.error(`[generateContent] Critical error:`, error);
    return {
      title: "",
      description: "",
      url: url,
      overview: "",
      search_results: "",
      favicon: "",
      ogImage: "",
      slug: generateSlug(url.replace(/https?:\/\/(www\.)?/, "")), // Basic fallback slug from URL
      error: error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}

// Simple API test function to help diagnose issues
export async function testMetadataApi(
  prevState: ActionState | null,
  formData: {
    url: string;
  },
): Promise<ActionState> {
  console.log("======= TESTING METADATA API =======");
  try {
    const url = formData.url;
    if (!url) {
      return { error: "URL is required" };
    }

    console.log(`Testing metadata API with URL: ${url}`);
    
    // Get current URL origin or use a default
    const origin = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Use full URL for API call
    const apiUrl = `${origin}/api/metadata?url=${encodeURIComponent(url)}`;
    console.log(`Calling API at: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    console.log(`API response status: ${response.status}`);
    
    // Get the raw response text
    const responseText = await response.text();
    console.log(`Response preview (first 200 chars): ${responseText.substring(0, 200)}`);
    
    let data;
    try {
      // Try to parse as JSON
      data = JSON.parse(responseText);
      console.log("Successfully parsed response as JSON:", data);
      
      return {
        success: true,
        message: "API test successful",
        data: data
      };
    } catch (error) {
      // If parsing fails, it's not valid JSON
      return {
        success: false,
        error: `Failed to parse response as JSON: ${error instanceof Error ? error.message : String(error)}`,
        data: { rawResponse: responseText.substring(0, 500) + "..." }
      };
    }
  } catch (error) {
    console.error("Error testing metadata API:", error);
    return {
      success: false,
      error: `API test failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
