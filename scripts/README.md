# Database Setup Instructions

This directory contains scripts to help you set up the database for the Directory application.

## Prerequisites

Before you begin, make sure you have:

1. Node.js installed
2. Turso CLI installed (`npm install -g turso`)
3. Access to create a Turso database or use a local SQLite database

## Setup Process

### 1. Create a Turso Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create my-directory-db
```

### 2. Get Your Database Credentials

```bash
# Get your database URL
turso db show my-directory-db --url

# Create an auth token
turso db tokens create my-directory-db
```

### 3. Create a .env File

Create a `.env` file in the root directory with the following content:

```
TURSO_DATABASE_URL=https://your-db-url-from-turso.turso.io
TURSO_AUTH_TOKEN=your-auth-token-from-turso
```

### 4. Run the Database Setup

```bash
# Run the setup script to create the combined migration file
npm run db:setup

# Run the migration to create tables in your database
npm run db:run-migration

# Seed the database with initial data
npm run db:seed
```

## Alternative: Local SQLite Database

If you prefer to use a local SQLite database instead of Turso:

1. Create a `.env` file with:
```
TURSO_DATABASE_URL=file:./local.db
TURSO_AUTH_TOKEN=
```

2. Follow the same steps as above starting from step 4.

## Troubleshooting

- If you encounter migration errors, check that your `.env` file contains the correct credentials.
- Make sure you have properly installed all dependencies with `npm install` or `pnpm install`.
- If you get "SQL string does not contain any statement" error, our custom migration script should fix this issue.

## Database Schema

The database contains two main tables:
- `bookmarks`: Stores all bookmark entries
- `categories`: Stores bookmark categories

For more information about the schema, check the `db/schema.ts` file. 