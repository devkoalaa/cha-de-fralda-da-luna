import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_URL_API: process.env.NEXT_PUBLIC_URL_API,
  },
};

export default nextConfig;
