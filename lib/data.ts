import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;

// Mock data for fallback when database queries fail
const mockCategories: Category[] = [
  {
    id: 'tools',
    name: 'Tools',
    slug: 'tools',
    description: 'Useful tools for teaching and learning',
    color: '#4f46e5',
    icon: 'tool',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'resources',
    name: 'Resources',
    slug: 'resources',
    description: 'Educational resources',
    color: '#16a34a',
    icon: 'book',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockBookmarks: any[] = [
  {
    bookmarks: {
      id: 1,
      title: 'Example Bookmark',
      slug: 'example-bookmark',
      url: 'https://example.com',
      description: 'This is a fallback bookmark when database is unavailable',
      overview: 'Fallback content',
      search_results: null,
      favicon: null,
      ogImage: null,
      categoryId: 'tools',
      isFavorite: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
    },
    categories: mockCategories[0],
  }
];

// Helper function to safely execute queries and handle both query builder objects and results
async function safelyExecuteQuery<T>(queryFn: () => Promise<any>, errorMsg: string, mockData: any[] = []): Promise<T[]> {
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
          return Array.isArray(executedResult) ? executedResult : mockData as T[];
        } catch (executeError) {
          console.error('Error executing query with .execute():', executeError);
          return mockData as T[];
        }
      } else {
        // It's a query builder object but doesn't have execute method
        // This is likely in production with an older Drizzle version
        console.error(`Query did not return an array:`, result);
        console.log('Using mock data as fallback');
        return mockData as T[];
      }
    }
    
    // Fallback for unexpected result types
    console.error(`Unexpected query result type: ${typeof result}`);
    return mockData as T[];
  } catch (error) {
    console.error(errorMsg, error);
    return mockData as T[];
  }
}

export async function getAllBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  const results = await safelyExecuteQuery<any>(
    () => db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id)),
    'Error fetching bookmarks:',
    mockBookmarks
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
    'Error fetching categories:',
    mockCategories
  );
}

export async function getBookmarkById(id: number): Promise<(Bookmark & { category: Category | null }) | null> {
  // Create a filtered mock data set with just the bookmark with the matching ID
  const filteredMockData = mockBookmarks.filter(bookmark => bookmark.bookmarks.id === id);
  
  const results = await safelyExecuteQuery<any>(
    () => db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .where(eq(bookmarks.id, id))
      .limit(1),
    `Error fetching bookmark by ID ${id}:`,
    filteredMockData
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
  // Create a filtered mock data set with just the bookmark with the matching slug
  const filteredMockData = mockBookmarks.filter(bookmark => bookmark.bookmarks.slug === slug);
  
  const results = await safelyExecuteQuery<any>(
    () => db
      .select()
      .from(bookmarks)
      .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
      .where(eq(bookmarks.slug, slug))
      .limit(1),
    `Error fetching bookmark by slug '${slug}'`,
    filteredMockData
  );
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}
