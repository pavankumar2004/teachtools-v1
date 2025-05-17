# Deploying TeachTools.site to Vercel

This guide provides step-by-step instructions for deploying TeachTools.site to Vercel using the dashboard approach.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
- Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push your code to a Git repository

If you haven't already, push your code to a Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repository-url>
git push -u origin main
```

### 2. Import your project in Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your Git repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install

### 3. Environment Variables

Add the following environment variables:

- `NEXT_PUBLIC_SITE_URL`: https://teachtools.site (or your custom domain)
- `DATABASE_URL`: Your database connection string (if using a database)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Troubleshooting

If you encounter build errors:

1. Check the build logs for specific error messages
2. Make sure all dependencies are properly installed
3. Verify that your project builds locally with `npm run build`
4. Try removing the `drizzle.config.ts` file if it's causing issues

## Custom Domain Setup

After deployment:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (teachtools.site)
4. Follow Vercel's instructions to configure DNS settings

## File-based Subscriber Storage

The current implementation uses file-based storage for subscribers. For a production environment, consider:

1. Using a database like Supabase, MongoDB, or Vercel Postgres
2. Implementing proper email verification
3. Adding admin authentication for the subscribers page

## Maintenance

To update your site:

1. Make changes to your local repository
2. Commit and push to your Git repository
3. Vercel will automatically deploy the changes

For more information, refer to the [Vercel documentation](https://vercel.com/docs).
