/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true,
  },
  // Required for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/raging-agent' : '',
};

module.exports = nextConfig; 