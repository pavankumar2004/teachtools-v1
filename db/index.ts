import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL || '';

// Create postgres connection
const client = postgres(connectionString, {
  max: 1,
  ssl: 'require',
});

// Create drizzle database instance
export const db = drizzle(client, { schema });
