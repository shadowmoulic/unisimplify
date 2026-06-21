import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "liquivest.in",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/university",
        destination: "/discover",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
