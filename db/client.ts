import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import "dotenv/config";

// Determine if we're in a build/static context
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Create a complete mock database implementation for build time
class MockDatabase {
  // This will be used to create a mock drizzle instance
  static createMockDb() {
    console.log('Creating mock database for build time');
    
    // Create a mock implementation that returns empty arrays for all operations
    return {
      // Mock select operation
      select: () => ({
        from: () => ({
          leftJoin: () => ({
            where: () => ({
              limit: () => Promise.resolve([]),
            }),
            orderBy: () => Promise.resolve([]),
          }),
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
          orderBy: () => Promise.resolve([]),
          limit: () => Promise.resolve([]),
          execute: () => Promise.resolve([]),
        }),
      }),
      // Mock insert operation
      insert: () => ({
        values: () => Promise.resolve({ insertId: 1 }),
      }),
      // Mock delete operation
      delete: () => ({
        where: () => Promise.resolve({ count: 0 }),
      }),
      // Mock update operation
      update: () => ({
        set: () => ({
          where: () => Promise.resolve({ count: 0 }),
        }),
      }),
      // Mock transaction
      transaction: (callback: any) => Promise.resolve(callback({})),
    };
  }
}

// Create the appropriate database client based on environment
let db: any;

// During build time, use the mock implementation
if (isBuildTime) {
  console.log('Using mock database for build time');
  db = MockDatabase.createMockDb() as any;
}
// For all runtime environments (local, development, production on Vercel), use the Vercel Postgres client
// Ensure POSTGRES_URL is available in all these environments.
else if (process.env.POSTGRES_URL) {
  console.log('Using Vercel Postgres client');
  db = vercelDrizzle(sql, { schema });
} 
// Fallback if POSTGRES_URL is not set, though this should ideally not happen in a configured environment.
else {
  console.error('POSTGRES_URL is not set. Database connection will likely fail or use mock.');
  // Fallback to mock, or handle error as appropriate for your application
  // Forcing mock here to prevent crashes if POSTGRES_URL is missing.
  db = MockDatabase.createMockDb() as any; 
}

// Export the database client
export { db };

// Export a function to get a fresh database connection for serverless functions
export function getDb() {
  if (isBuildTime) {
    return MockDatabase.createMockDb() as any;
  } 
  // For all runtime environments, use Vercel Postgres client
  else if (process.env.POSTGRES_URL) {
    return vercelDrizzle(sql, { schema });
  } 
  // Fallback if POSTGRES_URL is not set
  else {
    console.error('POSTGRES_URL is not set for getDb. Returning mock DB.');
    return MockDatabase.createMockDb() as any;
  }
}
