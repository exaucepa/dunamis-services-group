const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {}, // Pour éviter l'erreur Turbopack

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bfkgpthiqlsohosjouvs.supabase.co', // <- TON BUCKET SUPABASE
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = withPWA(nextConfig)