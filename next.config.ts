import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is enabled by default in Next.js 16.
  // PWA service worker is registered manually via /public/sw.js (see Fase 2).
  turbopack: {},
};

export default nextConfig;
