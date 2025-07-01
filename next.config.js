
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The env property allows you to expose environment variables to the browser.
  // We'll expose the server-provided FIREBASE_WEBAPP_CONFIG to the browser
  // as NEXT_PUBLIC_FIREBASE_CONFIG.
  env: {
    NEXT_PUBLIC_FIREBASE_CONFIG: process.env.FIREBASE_WEBAPP_CONFIG,
  },
};

module.exports = nextConfig;
