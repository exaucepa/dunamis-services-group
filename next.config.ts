import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.43.208", "localhost", "10.1.1.242"], // j'ai ajouté les 2 autres au cas où
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Autorise toutes les images de Supabase Storage
      },
    ],
  },
};

export default nextConfig;