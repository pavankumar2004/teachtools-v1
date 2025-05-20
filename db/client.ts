import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

// Determine if we're in a build/static context
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Create the database client
let db: any;

// During build time, use the mock implementation
if (isBuildTime) {
  console.log('Using mock database for build time');
  db = {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([]),
        }),
      }),
    }),
    insert: () => ({
      values: () => Promise.resolve({ insertId: 1 }),
    }),
    delete: () => ({
      where: () => Promise.resolve({ count: 0 }),
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve({ count: 0 }),
      }),
    }),
    transaction: (callback: any) => Promise.resolve(callback({})),
  };
}
// In production, use the Vercel Postgres client
else if (process.env.POSTGRES_URL) {
  console.log('Using Vercel Postgres client in production');
  db = vercelDrizzle(sql, { schema });
}
// For local development, use Supabase
else {
  console.log('Using Supabase database');
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:startup@db.ibbpzymbisxiakfhyuqc.supabase.co:5432/postgres";
  db = drizzle(postgres(connectionString, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10
  }), { schema });
}

export { db };

// Export a function to get a fresh database connection for serverless functions
export function getDb() {
  if (isBuildTime) {
    return {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
        }),
      }),
      insert: () => ({
        values: () => Promise.resolve({ insertId: 1 }),
      }),
      delete: () => ({
        where: () => Promise.resolve({ count: 0 }),
      }),
      update: () => ({
        set: () => ({
          where: () => Promise.resolve({ count: 0 }),
        }),
      }),
      transaction: (callback: any) => Promise.resolve(callback({})),
    };
  }
  // In production, use the Vercel Postgres client
  else if (process.env.POSTGRES_URL) {
    return vercelDrizzle(sql, { schema });
  }
  // For local development, use Supabase
  else {
    const connectionString = process.env.DATABASE_URL || "postgresql://postgres:startup@db.ibbpzymbisxiakfhyuqc.supabase.co:5432/postgres";
    return drizzle(postgres(connectionString, {
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10
    }), { schema });
  }
}
