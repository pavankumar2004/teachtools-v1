/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization
  images: {
    domains: ['teachtools.site'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Increase the timeout for long-running API routes
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

module.exports = nextConfig;
