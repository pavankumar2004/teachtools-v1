require('dotenv').config();
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  if (!process.env.TURSO_DATABASE_URL) {
    console.error('Error: TURSO_DATABASE_URL environment variable is not set');
    console.log('Please create a .env file with your Turso database credentials');
    process.exit(1);
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    console.error('Error: TURSO_AUTH_TOKEN environment variable is not set');
    console.log('Please create a .env file with your Turso database credentials');
    process.exit(1);
  }

  try {
    // Initialize database client
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log('Connected to database. Running migration...');

    // Path to the combined migration file
    const migrationFilePath = path.join(process.cwd(), 'migrations', 'combined_migration.sql');
    
    if (!fs.existsSync(migrationFilePath)) {
      console.error('Error: Combined migration file not found.');
      console.log('Please run the db-setup.js script first to create it.');
      process.exit(1);
    }

    // Read migration file
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
    
    // Split by semicolon to get individual statements
    const statements = migrationSQL.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    let count = 0;
    for (const statement of statements) {
      try {
        await client.execute(statement);
        count++;
      } catch (err) {
        console.warn(`Warning: Error executing statement: ${statement.substring(0, 100)}...`);
        console.warn(`Error: ${err.message}`);
        // Continue with other statements
      }
    }
    
    console.log(`Migration complete! Executed ${count} statements successfully.`);
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration(); 