/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true,
  },
  // Required for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/raging-agent' : '',
  // Add this to ensure proper client-side rendering
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig; 