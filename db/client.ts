import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

// Determine if we're in a build/static context
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Determine if we're in Vercel production environment
const isVercelProduction = process.env.VERCEL_ENV === 'production';

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

// Function to create a database connection for local development
function createLocalDbConnection() {
  // Use the database connection string from environment variables
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:startup@db.ibbpzymbisxiakfhyuqc.supabase.co:5432/postgres";
  
  try {
    console.log('Connecting to Supabase database...');
    // Create a postgres client with the connection string
    return postgres(connectionString, {
      ssl: 'require',
      max: 10, // Connection pool size
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10 // Connection timeout after 10 seconds
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    // Return mock client as fallback
    return { query: async () => [] } as any;
  }
}

// Create the appropriate database client based on environment
let db: any;

// During build time, use the mock implementation
if (isBuildTime) {
  console.log('Using mock database for build time');
  db = MockDatabase.createMockDb() as any;
}
// In Vercel production, use the Vercel Postgres client
else if (isVercelProduction && process.env.POSTGRES_URL) {
  console.log('Using Vercel Postgres client in production');
  db = vercelDrizzle(sql, { schema });
} 
// In all other environments, use postgres-js with Supabase
else {
  console.log('Using postgres-js with Supabase');
  db = drizzle(createLocalDbConnection(), { schema });
}

// Export the database client
export { db };

// Export a function to get a fresh database connection for serverless functions
export function getDb() {
  if (isBuildTime) {
    return MockDatabase.createMockDb() as any;
  } 
  // In Vercel production, use the Vercel Postgres client
  else if (isVercelProduction && process.env.POSTGRES_URL) {
    return vercelDrizzle(sql, { schema });
  } 
  // In all other environments, use postgres-js with Supabase
  else {
    return drizzle(createLocalDbConnection(), { schema });
  }
}
