import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * The storefront is a frontend-only demo: every page is prerendered and
   * shipped as static files, which keeps the deployment simple and fast.
   * Remove `output: "export"` if a backend is ever added.
   */
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
