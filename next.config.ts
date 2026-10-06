import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the output root so a stray lockfile outside the repo can't poison
  // the standalone tree (e.g. C:/Users/jacku/package-lock.json).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;