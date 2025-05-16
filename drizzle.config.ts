import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "pg",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:startup@db.ibbpzymbisxiakfhyuqc.supabase.co:5432/postgres",
  },
} satisfies Config;
