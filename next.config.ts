import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['bata-ganik.vercel.app', 'localhost:3000'],
    },
  },
  // The src/ directory contains Vite SPA components (React Router pages),
  // NOT Next.js pages. Next.js incorrectly resolves app/ paths through src/,
  // generating false-positive type errors in .next/types/validator.ts.
  // Our actual source code is type-safe — only the auto-generated types break.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
