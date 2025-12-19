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

        // OLD FORMAT 1: /city/MM-DD -> /city/monthname/DD
        // Example: /prague-cz/07-15 -> /prague-cz/july/15
        Object.entries(monthMap).forEach(([numMonth, monthName]) => {
            // Match patterns like: /prague-cz/07-15
            // Regex: /:city/MM-DD where MM is 01-12 and DD is 01-31
            for (let day = 1; day <= 31; day++) {
                const dayStr = day.toString().padStart(2, '0');
                redirects.push({
                    source: `/:city/${numMonth}-${dayStr}`,
                    destination: `/:city/${monthName}/${dayStr}`,
                    permanent: true, // 301 redirect for SEO
                });
            }
        });

        // OLD FORMAT 2: /city/MM -> /city/monthname
        // Example: /prague-cz/07 -> /prague-cz/july
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
