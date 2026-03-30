import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow API calls to your backend
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
    ]
  },
}

export default nextConfig
