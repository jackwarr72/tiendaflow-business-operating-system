import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the output root so a stray lockfile outside the repo can't poison
  // the standalone tree (e.g. C:/Users/jacku/package-lock.json).
  outputFileTracingRoot: __dirname,
  // Allow the dev server (incl. HMR websocket) to be reached over the LAN IP
  // so phones on the same Wi-Fi can test at http://<lan-ip>:3101.
  // Hostname only — no scheme, no port (Next docs).
  allowedDevOrigins: ["192.168.100.3"],
  experimental: {
    serverActions: {
      // Phone camera photos exceed the 1 MB default, which kills the
      // createProduct action with "Body exceeded 1 MB limit" (surfaced in
      // the browser as "An unexpected response was received from the server").
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;