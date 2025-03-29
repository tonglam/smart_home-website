/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "*.clerk.accounts.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "smart-home-hub.qitonglan.com",
      },
      {
        protocol: "https",
        hostname: "qitonglan.com",
      },
    ],
  },
  experimental: {
    // Configure cache invalidation periods
    staleTimes: {
      // For dynamic routes (like our API endpoints)
      dynamic: 30, // 30 seconds
      // For static routes (like dashboard, profile)
      static: 300, // 5 minutes
    },
  },
};

module.exports = nextConfig;
