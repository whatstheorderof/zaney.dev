import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the tracing root to this app — a stray lockfile in the home
  // directory otherwise makes Next infer the wrong workspace root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
