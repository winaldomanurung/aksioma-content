/** @type {import('next').NextConfig} */
const nextConfig = {
  // /api/check runs the Studio layout check in a headless Chromium (lib/server/layout-check.js).
  // Keep the browser packages out of the bundle and ship the compressed Chromium binary with the function.
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  outputFileTracingIncludes: {
    "/api/check": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
