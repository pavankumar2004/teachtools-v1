import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;

export async function getAllBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  try {
    // Make sure to execute the query by adding .execute() at the end
    const results = await db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .execute();
    
    console.log('Bookmarks query results structure:', {
      isArray: Array.isArray(results),
      length: results?.length,
      sampleKeys: results?.[0] ? Object.keys(results[0]) : 'no results'
    });
    
    // Ensure we always have an array to map over
    if (!Array.isArray(results)) {
      console.error('Bookmarks query did not return an array:', results);
      return [];
    }
    
    return results.map((row: any) => ({
      ...row.bookmarks,
      category: row.categories,
    }));
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    // Make sure to execute the query by adding .execute() at the end
    const results = await db.select().from(categories).execute();
    console.log('Categories query results:', results);
    
    // Ensure we always return an array
    if (!Array.isArray(results)) {
      console.error('Categories query did not return an array:', results);
      return [];
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

export async function getBookmarkById(id: number): Promise<(Bookmark & { category: Category | null }) | null> {
  try {
    const results = await db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .where(eq(bookmarks.id, id))
      .limit(1)
      .execute();
    
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }

    return {
      ...results[0].bookmarks,
      category: results[0].categories,
    };
  } catch (error) {
    console.error(`Error fetching bookmark by ID ${id}:`, error);
    return null;
  }
}

export async function getBookmarkBySlug(slug: string): Promise<(Bookmark & { category: Category | null }) | null> {
  try {
    const results = await db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .where(eq(bookmarks.slug, slug))
      .limit(1)
      .execute();
    
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }

    return {
      ...results[0].bookmarks,
      category: results[0].categories,
    };
  } catch (error) {
    console.error(`Error fetching bookmark by slug '${slug}':`, error);
    return null;
  }
}
