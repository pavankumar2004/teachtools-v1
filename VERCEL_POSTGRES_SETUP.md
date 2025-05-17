# Setting Up Vercel Postgres for TeachTools.site

This guide will walk you through setting up a production-ready Vercel Postgres database for your TeachTools.site project.

## Prerequisites

- A Vercel account
- Your TeachTools.site project deployed to Vercel (or ready to be deployed)

## Step 1: Create a Vercel Postgres Database

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the "Storage" tab in the top navigation
3. Click "Create Database" and select "Postgres"
4. Choose a name for your database (e.g., "teachtools-db")
5. Select the region closest to your target audience
6. Click "Create" to provision your database

## Step 2: Connect Your Project to Vercel Postgres

After creating the database, Vercel will automatically add the necessary environment variables to your project:

- `POSTGRES_URL`: The main connection string for your database
- `POSTGRES_PRISMA_URL`: A connection string formatted for Prisma
- `POSTGRES_URL_NON_POOLING`: A connection string for non-pooled connections
- `POSTGRES_USER`: The database username
- `POSTGRES_HOST`: The database host
- `POSTGRES_PASSWORD`: The database password
- `POSTGRES_DATABASE`: The database name

## Step 3: Initialize Your Database Schema

You'll need to run your Drizzle migrations to set up your database schema. There are two approaches:

### Option 1: Run Migrations Locally

1. Add the Vercel Postgres connection string to your local environment:

```bash
# Add to your .env.local file
DATABASE_URL="your_vercel_postgres_connection_string"
```

2. Run your migrations:

```bash
npm run db:migrate
```

### Option 2: Run Migrations During Deployment

Add a build step to your `package.json` to run migrations during deployment:

```json
"scripts": {
  "build": "next build && npm run db:migrate",
  "db:migrate": "drizzle-kit push:pg"
}
```

## Step 4: Verify Your Database Connection

1. Deploy your application to Vercel
2. Check the deployment logs to verify the database connection
3. Test your application's database functionality

## Troubleshooting

If you encounter any issues:

1. **Connection Errors**: Verify that your environment variables are correctly set in Vercel
2. **Migration Errors**: Check your migration scripts and ensure they're compatible with Vercel Postgres
3. **Performance Issues**: Consider adding indexes to frequently queried columns

## Database Management

You can manage your Vercel Postgres database directly from the Vercel Dashboard:

1. Navigate to the "Storage" tab
2. Select your database
3. Use the "Data" tab to browse and query your data
4. Use the "Queries" tab to run SQL queries

## Backups and Recovery

Vercel Postgres automatically creates daily backups of your database. To restore from a backup:

1. Navigate to your database in the Vercel Dashboard
2. Go to the "Settings" tab
3. Scroll to the "Backups" section
4. Select a backup and click "Restore"

## Next Steps

- Set up proper error handling for database operations
- Implement database connection pooling for better performance
- Consider adding database monitoring and alerting
