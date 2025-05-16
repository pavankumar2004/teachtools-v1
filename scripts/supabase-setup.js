require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupSupabaseDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set');
    console.log('Please check your .env file');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    // Create categories table
    console.log('Creating categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        slug TEXT NOT NULL UNIQUE,
        color TEXT,
        icon TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);

    // Create bookmarks table
    console.log('Creating bookmarks table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        category_id TEXT REFERENCES categories(id),
        tags TEXT,
        favicon TEXT,
        screenshot TEXT,
        overview TEXT,
        og_image TEXT,
        og_title TEXT,
        og_description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_visited TIMESTAMP,
        notes TEXT,
        is_archived BOOLEAN NOT NULL DEFAULT FALSE,
        is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
        search_results TEXT
      )
    `);

    // Create indexes
    console.log('Creating indexes...');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_url_unique ON bookmarks (url)');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_slug_unique ON bookmarks (slug)');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique ON categories (slug)');

    // Seed initial data
    console.log('Seeding initial data...');

    // Insert categories
    const categories = [
      {
        id: 'development',
        name: 'Development',
        description: 'Programming and development resources',
        slug: 'development',
        color: '#0ea5e9',
        icon: '💻'
      },
      {
        id: 'design',
        name: 'Design',
        description: 'Design tools and inspiration',
        slug: 'design',
        color: '#f43f5e',
        icon: '🎨'
      },
      {
        id: 'productivity',
        name: 'Productivity',
        description: 'Tools and resources for getting things done',
        slug: 'productivity',
        color: '#22c55e',
        icon: '⚡'
      },
      {
        id: 'learning',
        name: 'Learning',
        description: 'Educational resources and tutorials',
        slug: 'learning',
        color: '#8b5cf6',
        icon: '📚'
      }
    ];

    // Check if categories table is empty
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCount.rows[0].count) === 0) {
      for (const cat of categories) {
        await client.query(
          'INSERT INTO categories (id, name, description, slug, color, icon) VALUES ($1, $2, $3, $4, $5, $6)',
          [cat.id, cat.name, cat.description, cat.slug, cat.color, cat.icon]
        );
      }
      console.log(`Inserted ${categories.length} categories.`);
    } else {
      console.log('Categories already exist, skipping seed.');
    }

    // Insert bookmarks
    const bookmarks = [
      {
        url: 'https://github.com',
        title: 'GitHub',
        slug: 'github',
        description: 'Where the world builds software',
        categoryId: 'development',
        favicon: 'https://github.githubassets.com/favicons/favicon.svg',
        ogImage: 'https://github.githubassets.com/images/modules/site/social-cards/homepage.png',
        overview: 'GitHub is where over 100 million developers shape the future of software, together.',
        isFavorite: true
      },
      {
        url: 'https://figma.com',
        title: 'Figma',
        slug: 'figma',
        description: 'The collaborative interface design tool',
        categoryId: 'design',
        favicon: 'https://static.figma.com/app/icon/1/favicon.svg',
        ogImage: 'https://cdn.sanity.io/images/599r6htc/localized/a279334dfd43febf8fec669011443159e9089cda-2400x1260.png',
        overview: 'Figma is the leading collaborative design tool for building meaningful products.',
        isFavorite: true
      },
      {
        url: 'https://notion.so',
        title: 'Notion',
        slug: 'notion',
        description: 'All-in-one workspace',
        categoryId: 'productivity',
        favicon: 'https://www.notion.so/images/favicon.ico',
        ogImage: 'https://www.notion.so/cdn-cgi/image/format=auto,width=640,quality=100/front-static/shared/icons/notion-app-icon-3d.png',
        overview: 'A new tool that blends your everyday work apps into one.',
        isFavorite: true
      }
    ];

    // Check if bookmarks table is empty
    const bookmarkCount = await client.query('SELECT COUNT(*) FROM bookmarks');
    if (parseInt(bookmarkCount.rows[0].count) === 0) {
      for (const bm of bookmarks) {
        await client.query(
          `INSERT INTO bookmarks 
           (url, title, slug, description, category_id, favicon, og_image, overview, is_favorite) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [bm.url, bm.title, bm.slug, bm.description, bm.categoryId, bm.favicon, bm.ogImage, bm.overview, bm.isFavorite]
        );
      }
      console.log(`Inserted ${bookmarks.length} bookmarks.`);
    } else {
      console.log('Bookmarks already exist, skipping seed.');
    }

    console.log('✅ Supabase database setup complete!');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupSupabaseDatabase(); 