/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Use remotePatterns for Next.js 13 and later
      {
        protocol: "https", // Usually https
        hostname: "thefoschini.vtexassets.com", // The domain of your images
        port: "", // Leave empty if no port specified
        pathname: "/**", // Match all paths
      },
      {
        protocol: "https", // or 'http' if needed
        hostname: "thefoschini.vtexassets.com",
        port: "", // leave empty if no port specified
        pathname: "/**", // match all paths under this hostname
      },
      // Add more domains here if needed
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-domain.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

module.exports = nextConfig;
