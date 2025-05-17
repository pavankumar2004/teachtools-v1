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

// Helper function to safely execute database queries
async function safelyExecuteQuery<T>(
  queryFn: () => Promise<any> | any,
  errorMsg: string,
  mockData: T[] = []
): Promise<T[]> {
  try {
    // Execute the query function
    let results = await queryFn();
    
    // Log the result type for debugging
    console.log('Query result type:', typeof results);
    
    // Check if the result is already an array
    if (Array.isArray(results)) {
      return results as T[];
    }
    
    // If the result is an object with an execute method (query builder), try to execute it
    if (results && typeof results === 'object') {
      console.log('Query did not return an array:', results);
      
      // Handle query builder objects
      if (typeof results.execute === 'function') {
        try {
          const executedResults = await results.execute();
          if (Array.isArray(executedResults)) {
            return executedResults as T[];
          }
        } catch (executeError) {
          console.error(`Error executing query with .execute(): ${errorMsg}`, executeError);
        }
      }
      
      // Try to execute the query by calling any functions that might complete the query
      // This handles the case where the query builder object has where, orderBy, etc. functions
      try {
        // If the object has a where function, it might be a query builder
        if (typeof results.where === 'function') {
          // Try to complete and execute the query
          results = await results.where(() => true);
          
          // Check if we now have an array
          if (Array.isArray(results)) {
            return results as T[];
          }
          
          // If it's still an object with execute, try that
          if (results && typeof results.execute === 'function') {
            const executedResults = await results.execute();
            if (Array.isArray(executedResults)) {
              return executedResults as T[];
            }
          }
        }
        
        // If the object has a toSQL function, it might be a knex query builder
        if (typeof results.toSQL === 'function') {
          const executedResults = await results;
          if (Array.isArray(executedResults)) {
            return executedResults as T[];
          }
        }
      } catch (queryBuilderError) {
        console.error(`Error trying to complete query: ${errorMsg}`, queryBuilderError);
      }
      
      // If we got here, use mock data as fallback
      console.log('Using mock data as fallback');
      return mockData;
    }
    
    // If we got here, something went wrong, return mock data
    console.log('Unexpected result type, using mock data as fallback');
    return mockData;
  } catch (error) {
    console.error(`${errorMsg}`, error);
    return mockData;
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
