import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'centrodeginecologia.com.br',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
