import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

// Use the Supabase PostgreSQL connection string
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:startup@db.ibbpzymbisxiakfhyuqc.supabase.co:5432/postgres";

// Create a postgres client with the connection string
const client = postgres(connectionString);

// Create a drizzle client with the postgres client
export const db = drizzle(client, { schema });
