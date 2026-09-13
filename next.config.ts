import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: Next.js standalone output for minimal production Docker container
  output: "standalone",
  allowedDevOrigins: ["kda.idor.top", "*.idor.top"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
      },
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
      },
    ],
  },
};

export default nextConfig;
