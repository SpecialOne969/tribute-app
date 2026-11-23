import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Ensure the data directory is bundled with the /api/tributes serverless function
  outputFileTracingIncludes: {
    "/api/tributes": ["./data/**/*"],
  },
};

export default nextConfig;
