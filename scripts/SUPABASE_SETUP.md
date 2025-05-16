# Supabase Database Setup Instructions

This project is now configured to use Supabase PostgreSQL as the database backend.

## Prerequisites

Before you begin, make sure you have:

1. Node.js and npm installed
2. A Supabase account and project set up (can be created at [supabase.com](https://supabase.com))

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL=postgresql://postgres:your-password@your-project-ref.supabase.co:5432/postgres
ADMIN_PASSWORD=your-admin-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace `your-password` and `your-project-ref` with your actual Supabase credentials.

## Database Setup Steps

1. Install dependencies if you haven't already:

```bash
npm install
```

2. Run the Supabase setup script to create the tables and seed initial data:

```bash
npm run db:supabase-setup
```

3. Start the development server:

```bash
npm run dev
```

4. Access the application at http://localhost:3000

## Database Management

- **Generate migrations**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **View database with Studio**: `npm run db:studio`

## Supabase Configuration

This application uses the following Supabase setup:

1. A PostgreSQL database for storing bookmarks and categories
2. Two main tables:
   - `categories`: Stores bookmark categories
   - `bookmarks`: Stores all bookmark entries

## Database Schema

The database contains two main tables:
- `bookmarks`: Stores all bookmark entries with rich metadata
- `categories`: Stores bookmark categories with customization options

## Additional Features (Optional)

For additional functionality, you can set up:

- **GEMINI_API_KEY**: For AI content generation
- **EXASEARCH_API_KEY**: For enhanced search capabilities
- **LOOPS_API_KEY**: For newsletter functionality 