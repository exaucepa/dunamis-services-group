const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest.json$/, /app-build-manifest.json$/], // <- anti bug WorkerError
  fallbacks: {
    document: '/offline', // optionnel mais aide
  }
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {} // <- dit à Vercel d'utiliser turbopack sans crasher
  }
}

module.exports = withPWA(nextConfig)