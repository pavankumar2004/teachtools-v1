import { db } from './client';
import { bookmarks, categories } from './schema';
import { sql } from '@vercel/postgres';

async function migrate() {
  console.log('Starting database migration...');

  try {
    // Create the categories table
    console.log('Creating categories table...');
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        color VARCHAR(50),
        icon VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Categories table created successfully');

    // Create the bookmarks table
    console.log('Creating bookmarks table...');
    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url TEXT NOT NULL UNIQUE,
        slug VARCHAR(255) UNIQUE NOT NULL,
        overview TEXT,
        search_results TEXT,
        favicon TEXT,
        og_image TEXT,
        category_id INTEGER REFERENCES categories(id),
        is_favorite BOOLEAN DEFAULT FALSE,
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Bookmarks table created successfully');

    // Create indexes for better performance
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_bookmarks_category_id ON bookmarks(category_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookmarks_slug ON bookmarks(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);`;
    console.log('Indexes created successfully');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrate()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
