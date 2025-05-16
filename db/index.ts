import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For Vercel serverless functions, we need to create a new connection for each request
// to avoid connection pool exhaustion
let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  // Database connection string from environment variables
  const connectionString = process.env.DATABASE_URL || '';
  
  // In production, we create a new connection for each request
  if (process.env.NODE_ENV === 'production' || !client) {
    client = postgres(connectionString, {
      max: 1,
      ssl: 'require',
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  
  return drizzle(client, { schema });
}

// For convenience in development, export a singleton instance
export const db = getDb();
