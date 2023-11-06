/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  skipTrailingSlashRedirect: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
