require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

console.log('Running migration to add subscribers table...');

try {
  // Ensure the SQL migration directory exists
  const migrationDir = path.join(__dirname, '../db/migrations/sql');
  
  // Run the migration using tsx
  execSync('npx tsx db/migrations/add-subscribers-table.ts', {
    stdio: 'inherit',
  });
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
