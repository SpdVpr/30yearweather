/** @type {import('next').NextConfig} */
const nextConfig = {
    // Exclude large data files from serverless function bundle
    // This keeps the function under Vercel's 250MB limit
    // Data will be fetched from CDN at runtime instead
    experimental: {
        outputFileTracingExcludes: {
            '*': [
                './public/data/**/*',
            ],
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
        ];
    },
    async redirects() {
        // All redirects are now handled by middleware (src/middleware.ts)
        // This is more efficient and avoids the 5MB body limit on Vercel
        return [];
    },
};

module.exports = nextConfig;
