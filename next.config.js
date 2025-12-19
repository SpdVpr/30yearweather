/** @type {import('next').NextConfig} */
const nextConfig = {
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
        // Map numeric months to month names
        const monthMap = {
            '01': 'january',
            '02': 'february',
            '03': 'march',
            '04': 'april',
            '05': 'may',
            '06': 'june',
            '07': 'july',
            '08': 'august',
            '09': 'september',
            '10': 'october',
            '11': 'november',
            '12': 'december',
        };

        const redirects = [];

        // Redirect old numeric month format to new month name format
        // Pattern: /city/MM/DD -> /city/monthname/DD
        Object.entries(monthMap).forEach(([numMonth, monthName]) => {
            redirects.push({
                source: `/:city/${numMonth}/:day`,
                destination: `/:city/${monthName}/:day`,
                permanent: true, // 301 redirect for SEO
            });
        });

        // Also redirect month-only pages: /city/MM -> /city/monthname
        Object.entries(monthMap).forEach(([numMonth, monthName]) => {
            redirects.push({
                source: `/:city/${numMonth}`,
                destination: `/:city/${monthName}`,
                permanent: true, // 301 redirect for SEO
            });
        });

        return redirects;
    },
};

module.exports = nextConfig;
