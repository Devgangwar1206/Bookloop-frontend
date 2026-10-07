import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  // Allow local network and localhost in development
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.12.52"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  output: "standalone",

  transpilePackages: ["motion"],
};

export default nextConfig;