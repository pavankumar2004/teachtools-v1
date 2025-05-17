import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;

// Helper function to safely execute queries and handle both query builder objects and results
async function safelyExecuteQuery<T>(queryFn: () => Promise<any>, errorMsg: string): Promise<T[]> {
  try {
    // Execute the query
    const result = await queryFn();
    
    // Log the result structure for debugging
    console.log(`Query result type: ${typeof result}`);
    
    // Handle different result types
    if (Array.isArray(result)) {
      // Direct array result - common in newer Drizzle versions
      return result as T[];
    } else if (result && typeof result === 'object') {
      // For older Drizzle versions that return query builder objects
      // Check if it has common query builder methods
      if (typeof result.execute === 'function') {
        try {
          // If it has execute method, try using it
          const executedResult = await result.execute();
          return Array.isArray(executedResult) ? executedResult : [];
        } catch (executeError) {
          console.error('Error executing query with .execute():', executeError);
          return [];
        }
      } else {
        // It's some other object, but not an array - log and return empty array
        console.error(`Query did not return an array:`, result);
        return [];
      }
    }
    
    // Fallback for unexpected result types
    console.error(`Unexpected query result type: ${typeof result}`);
    return [];
  } catch (error) {
    console.error(errorMsg, error);
    return [];
  }
}

export async function getAllBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  const results = await safelyExecuteQuery<any>(
    () => db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id)),
    'Error fetching bookmarks:'
  );
  
  // If we got results, map them to the expected format
  if (results.length > 0) {
    return results.map((row: any) => ({
      ...row.bookmarks,
      category: row.categories,
    }));
  }
  
  return [];
}

export async function getAllCategories(): Promise<Category[]> {
  return await safelyExecuteQuery<Category>(
    () => db.select().from(categories),
    'Error fetching categories:'
  );
}

export async function getBookmarkById(id: number): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await safelyExecuteQuery<any>(
    () => db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .where(eq(bookmarks.id, id))
      .limit(1),
    `Error fetching bookmark by ID ${id}:`
  );
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}

export async function getBookmarkBySlug(slug: string): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await safelyExecuteQuery<any>(
    () => db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .where(eq(bookmarks.slug, slug))
      .limit(1),
    `Error fetching bookmark by slug '${slug}'`
  );
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}
