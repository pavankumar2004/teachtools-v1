const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create the scripts directory if it doesn't exist
if (!fs.existsSync(path.join(process.cwd(), 'scripts'))) {
  fs.mkdirSync(path.join(process.cwd(), 'scripts'));
}

// Function to create combined SQL file
function createCombinedMigrationFile() {
  console.log('Creating combined migration file...');
  
  const migrationsDir = path.join(process.cwd(), 'migrations');
  const combinedFilePath = path.join(migrationsDir, 'combined_migration.sql');
  
  // Get all .sql files in migrations directory
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql') && !file.includes('combined_migration'));
  
  // Sort them to ensure proper order
  migrationFiles.sort();
  
  let combinedContent = '';
  
  // Process each file
  migrationFiles.forEach(fileName => {
    const filePath = path.join(migrationsDir, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split by statement breakpoint and filter empty statements
    const statements = content.split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Add each valid statement to combined content
    statements.forEach(stmt => {
      combinedContent += stmt + ';\n';
    });
  });
  
  // Write combined content to file
  fs.writeFileSync(combinedFilePath, combinedContent);
  console.log(`Combined migration created at: ${combinedFilePath}`);
  
  return combinedFilePath;
}

// Setup instructions
console.log('\n===== DATABASE SETUP INSTRUCTIONS =====\n');
console.log('1. You need to create a Turso database first');
console.log('   Run: npm install -g turso (if not already installed)');
console.log('   Run: turso auth login');
console.log('   Run: turso db create my-directory-db');
console.log('\n2. After creating the database, get your credentials:');
console.log('   Run: turso db tokens create my-directory-db');
console.log('   Run: turso db show my-directory-db --url');
console.log('\n3. Create a .env file with these credentials:');
console.log('   TURSO_DATABASE_URL=https://your-db-url.turso.io');
console.log('   TURSO_AUTH_TOKEN=your-auth-token');
console.log('\n4. Then run migrations with:');
console.log('   Run: npm run db:setup');
console.log('\n5. Finally seed the database:');
console.log('   Run: npm run db:seed');

// Create the combined migration file
createCombinedMigrationFile(); 