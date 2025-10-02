import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arbetsformedlingen.se",
        pathname: "/**", // tillåter alla paths
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**", // tillåter alla paths
      },
    ],
  },
};

export default nextConfig;
