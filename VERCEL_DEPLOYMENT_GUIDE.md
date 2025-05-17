# TeachTools.site Vercel Deployment Guide

This guide will help you fix the current deployment issues and successfully deploy TeachTools.site to Vercel with a working database connection.

## Current Issues

Your site is currently deployed at:
- teachtools-v1.vercel.app
- teachtools-v1-a7kofd6hl-pavans-projects-07941ffb.vercel.app

But it's encountering errors:
- `TypeError: (intermediate value).map is not a function` - This indicates database connection issues
- Functions cannot be passed directly to Client Components - This is a serialization error

## Step 1: Set Up Vercel Postgres

1. **Create a Vercel Postgres Database**:
   - Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to the "Storage" tab in the top navigation
   - Click "Create Database" and select "Postgres"
   - Choose a name for your database (e.g., "teachtools-db")
   - Select the region closest to your target audience
   - Click "Create" to provision your database

2. **Connect Your Project to Vercel Postgres**:
   - After creating the database, Vercel will automatically add the necessary environment variables to your project
   - These include `POSTGRES_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.

## Step 2: Update Environment Variables

Make sure your Vercel project has the following environment variables:

1. **Required Variables**:
   - `NEXT_PUBLIC_SITE_URL`: Set to your domain (e.g., https://teachtools.site or https://teachtools-v1.vercel.app)
   - `DATABASE_URL`: This should be automatically set by Vercel Postgres

2. **Optional Variables** (if you're using these features):
   - `JWT_SECRET`: For authentication
   - `ADMIN_PASSWORD`: For admin access

## Step 3: Deploy with Database Migrations

1. **Redeploy Your Project**:
   - Go to your project in the Vercel dashboard
   - Navigate to the "Deployments" tab
   - Click "Redeploy" on your latest deployment

2. **Run Database Migrations**:
   - After deployment, go to your project's "Functions" tab
   - Click "Create Function"
   - Select "Node.js" as the runtime
   - Paste the following code:

```javascript
// db-migrate.js
const { exec } = require('child_process');

module.exports = async (req, res) => {
  try {
    // Run the migration script
    exec('npx tsx db/migrate.ts', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: error.message, stderr });
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      res.status(200).json({ message: 'Migration successful', stdout });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

3. **Run the Migration Function**:
   - Visit the URL of your newly created function to run the migration

## Step 4: Verify Database Connection

1. **Check Logs**:
   - In your Vercel dashboard, go to the "Logs" tab
   - Look for any database connection errors
   - Verify that your application is using Vercel Postgres in production

2. **Test Your Application**:
   - Visit your deployed site
   - Check if the home page loads correctly
   - Try the admin page and other features that use the database

## Troubleshooting

If you're still encountering issues:

1. **Database Connection Issues**:
   - Make sure your `db/client.ts` file is correctly configured to use Vercel Postgres in production
   - Check that the `@vercel/postgres` package is installed
   - Verify that environment variables are correctly set in Vercel

2. **Map Function Errors**:
   - This usually happens when your code expects an array but gets something else
   - Make sure all your components handle the case where data might be null or undefined
   - Add proper error handling and fallbacks

3. **Serialization Errors**:
   - Functions can't be passed from server to client components
   - Make sure you're not passing database client functions directly to client components
   - Use data objects instead of functions

## Next Steps After Successful Deployment

1. **Set Up Custom Domain**:
   - In your Vercel project, go to "Settings" → "Domains"
   - Add your custom domain (teachtools.site)
   - Follow the instructions to configure DNS settings

2. **Set Up Analytics**:
   - Consider adding Vercel Analytics to track site usage
   - Go to "Settings" → "Analytics" to set this up

3. **Regular Backups**:
   - Vercel Postgres includes automatic backups
   - You can also set up manual backups for critical data

4. **Monitoring**:
   - Set up monitoring for your application
   - Consider using Vercel's built-in monitoring tools

Remember to always test your changes locally before deploying to production!
