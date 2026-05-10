import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  /* 
  experimental: {
    turbo: {
      root: "..",
    },
  },
  */
};

export default nextConfig;
