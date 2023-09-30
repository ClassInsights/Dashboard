/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
