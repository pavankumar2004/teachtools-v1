const fs = require('fs');
const path = require('path');
const { Database } = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

// Ensure we're using a local SQLite database
const DB_PATH = path.join(process.cwd(), 'local.db');
console.log(`Setting up local SQLite database at: ${DB_PATH}`);

// Remove existing database if it exists
if (fs.existsSync(DB_PATH)) {
  console.log('Removing existing database...');
  fs.unlinkSync(DB_PATH);
}

// Create a new database
const db = new Database(DB_PATH);

// Create tables
console.log('Creating database tables...');

db.serialize(() => {
  // Create categories table
  db.run(`
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      slug TEXT NOT NULL UNIQUE,
      color TEXT,
      icon TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER
    )
  `);

  // Create bookmarks table
  db.run(`
    CREATE TABLE bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      category_id TEXT,
      tags TEXT,
      favicon TEXT,
      screenshot TEXT,
      overview TEXT,
      og_image TEXT,
      og_title TEXT,
      og_description TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      last_visited INTEGER,
      notes TEXT,
      is_archived INTEGER NOT NULL DEFAULT 0,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      search_results TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Create indexes
  db.run('CREATE UNIQUE INDEX bookmarks_url_unique ON bookmarks (url)');
  db.run('CREATE UNIQUE INDEX bookmarks_slug_unique ON bookmarks (slug)');
  db.run('CREATE UNIQUE INDEX categories_slug_unique ON categories (slug)');

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

  const insertCategory = db.prepare('INSERT INTO categories (id, name, description, slug, color, icon) VALUES (?, ?, ?, ?, ?, ?)');
  categories.forEach(cat => {
    insertCategory.run(cat.id, cat.name, cat.description, cat.slug, cat.color, cat.icon);
  });
  insertCategory.finalize();

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
      isFavorite: 1
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
      isFavorite: 1
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
      isFavorite: 1
    }
  ];

  const insertBookmark = db.prepare(
    'INSERT INTO bookmarks (url, title, slug, description, category_id, favicon, og_image, overview, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  bookmarks.forEach(bm => {
    insertBookmark.run(
      bm.url, 
      bm.title, 
      bm.slug, 
      bm.description,
      bm.categoryId,
      bm.favicon,
      bm.ogImage,
      bm.overview,
      bm.isFavorite
    );
  });
  insertBookmark.finalize();
});

// Close the database connection
db.close(err => {
  if (err) {
    console.error('Error closing database:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Local SQLite database setup complete!');
  console.log('\nNow update your .env file with:');
  console.log('TURSO_DATABASE_URL=file:./local.db');
  console.log('TURSO_AUTH_TOKEN=');
  console.log('\nThen you can start the app with: npm run dev');
}); 