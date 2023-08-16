/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['src'],
    },
    basePath: '/sosialhjelp/mock-alt',
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    experimental: {
        serverActions: true,
    },
    output: 'standalone',
    trailingSlash: true,
};

module.exports = nextConfig;
