/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'chinalink.tw',
          },
        ],
        destination: 'https://www.chinalink.tw/:path*',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (!isServer) {
      // Prevent client bundle from attempting to resolve Node.js built-ins
      // that are used by server-only packages (postgres, drizzle-orm)
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        perf_hooks: false,
      }
    }

    return webpackConfig
  },
}

export default nextConfig
