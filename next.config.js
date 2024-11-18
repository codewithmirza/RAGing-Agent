/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/RAGing-Agent' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/RAGing-Agent/' : '',
  trailingSlash: true,
  // This is important for API routes
  experimental: {
    workerThreads: true,
    cpus: 1
  }
};

module.exports = nextConfig; 