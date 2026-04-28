import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages deployment via @cloudflare/next-on-pages
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    // Allow images from common PC component image hosts
    remotePatterns: [
      { hostname: 'cdn.newegg.com' },
      { hostname: 'c1.neweggimages.com' },
      { hostname: 'm.media-amazon.com' },
      { hostname: 'pisces.bbystatic.com' },
    ],
    unoptimized: true, // required for Cloudflare edge deployment
  },
}

export default nextConfig
