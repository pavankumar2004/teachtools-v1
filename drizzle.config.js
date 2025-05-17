// Using JS instead of TS to avoid type errors during build
module.exports = {
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "db.ibbpzymbisxiakfhyuqc.supabase.co",
    port: 5432,
    user: "postgres",
    password: "startup",
    database: "postgres",
    ssl: true
  }
};
