/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig

module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
    reactStrictMode: false,
  };
};
