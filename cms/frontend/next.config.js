/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: false,
  exportPathMap: async function(
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" }
    };
  }
}

module.exports = nextConfig
