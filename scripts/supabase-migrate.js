require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runSupabaseMigration() {
  if (!process.env.SUPABASE_URL) {
    console.error('Error: SUPABASE_URL environment variable is not set');
    console.log('Please create a .env file with your Supabase credentials');
    process.exit(1);
  }

  if (!process.env.SUPABASE_KEY) {
    console.error('Error: SUPABASE_KEY environment variable is not set');
    console.log('Please create a .env file with your Supabase credentials');
    process.exit(1);
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    
    console.log('Connected to Supabase. Running migration...');

    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, 'supabase-migration.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content by semicolons to get individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each SQL statement
    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Use the REST API to execute the SQL
        const { error } = await supabase.from('_sql').select('*', { count: 'exact' })
          .execute(statement);
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (stmtError) {
        console.error(`Error executing statement ${i + 1}:`, stmtError);
      }
    }
    
    console.log(`Migration completed. ${successCount} out of ${statements.length} statements executed successfully.`);
    
    // Alternative approach - try direct SQL execution
    if (successCount === 0) {
      console.log('Trying alternative approach with direct SQL execution...');
      
      try {
        // Create categories table
        console.log('Creating categories table...');
        const { error: categoriesError } = await supabase
          .from('_sql')
          .select('*')
          .execute(`
            CREATE TABLE IF NOT EXISTS categories (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              slug TEXT UNIQUE NOT NULL,
              color TEXT,
              icon TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE
            )
          `);
        
        if (categoriesError) {
          console.error('Error creating categories table:', categoriesError);
        } else {
          console.log('Categories table created successfully');
        }
        
        // Create bookmarks table
        console.log('Creating bookmarks table...');
        const { error: bookmarksError } = await supabase
          .from('_sql')
          .select('*')
          .execute(`
            CREATE TABLE IF NOT EXISTS bookmarks (
              id SERIAL PRIMARY KEY,
              url TEXT NOT NULL UNIQUE,
              title TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              description TEXT,
              category_id TEXT REFERENCES categories(id),
              tags TEXT,
              favicon TEXT,
              screenshot TEXT,
              overview TEXT,
              og_image TEXT,
              og_title TEXT,
              og_description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              last_visited TIMESTAMP WITH TIME ZONE,
              notes TEXT,
              is_archived BOOLEAN DEFAULT FALSE NOT NULL,
              is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
              search_results TEXT
            )
          `);
        
        if (bookmarksError) {
          console.error('Error creating bookmarks table:', bookmarksError);
        } else {
          console.log('Bookmarks table created successfully');
        }
      } catch (directError) {
        console.error('Error with direct SQL execution:', directError);
      }
    }
    
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
runSupabaseMigration()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
