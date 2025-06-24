import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  },
}

export default nextConfig
