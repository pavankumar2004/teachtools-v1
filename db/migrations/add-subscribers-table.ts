import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL || '';

async function main() {
  console.log('Running migration to add subscribers table...');
  
  // Create postgres connection
  const migrationClient = postgres(connectionString, { max: 1, ssl: 'require' });
  
  // Create drizzle database instance for migrations
  const db = drizzle(migrationClient);
  
  // Run migrations
  await migrate(db, { migrationsFolder: './db/migrations/sql' });
  
  console.log('Migration completed successfully');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
