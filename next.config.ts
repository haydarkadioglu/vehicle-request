/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Similar to TypeScript's ignoreBuildErrors, this will ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
