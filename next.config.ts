import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // lint separately; ESLint v8 conflicts with next lint in v15
  },
  images: {
    remotePatterns: [
      { hostname: 'cdn.newegg.com' },
      { hostname: 'c1.neweggimages.com' },
      { hostname: 'm.media-amazon.com' },
      { hostname: 'pisces.bbystatic.com' },
    ],
    unoptimized: true,
  },
}

export default nextConfig
