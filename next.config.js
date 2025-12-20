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
            '01': 'january', '02': 'february', '03': 'march', '04': 'april',
            '05': 'may', '06': 'june', '07': 'july', '08': 'august',
            '09': 'september', '10': 'october', '11': 'november', '12': 'december',
        };

        // Map old slugs (with country codes) to new slugs (without country codes)
        const oldToNewSlugMap = {
            // North America
            'new-york-us': 'new-york',
            'los-angeles-us': 'los-angeles',
            'san-francisco-us': 'san-francisco',
            'miami-us': 'miami',
            'vancouver-ca': 'vancouver',
            'toronto-ca': 'toronto',
            'mexico-city-mx': 'mexico-city',
            'chicago-us': 'chicago',
            'boston-us': 'boston',
            'las-vegas-us': 'las-vegas',
            'honolulu-us': 'honolulu',
            'montreal-ca': 'montreal',
            'calgary-ca': 'calgary',
            'new-orleans-us': 'new-orleans',
            'whistler-ca': 'whistler',

            // South America
            'rio-de-janeiro-br': 'rio-de-janeiro',
            'buenos-aires-ar': 'buenos-aires',
            'lima-pe': 'lima',
            'santiago-cl': 'santiago',
            'bogota-co': 'bogota',
            'sao-paulo-br': 'sao-paulo',
            'quito-ec': 'quito',
            'cusco-pe': 'cusco',
            'cartagena-co': 'cartagena',

            // Europe
            'prague-cz': 'prague',
            'berlin-de': 'berlin',
            'london-uk': 'london',
            'paris-fr': 'paris',
            'rome-it': 'rome',
            'barcelona-es': 'barcelona',
            'vienna-at': 'vienna',
            'zurich-ch': 'zurich',
            'athens-gr': 'athens',
            'amsterdam-nl': 'amsterdam',
            'madrid-es': 'madrid',
            'brussels-be': 'brussels',
            'warsaw-pl': 'warsaw',
            'budapest-hu': 'budapest',
            'lisbon-pt': 'lisbon',
            'dublin-ie': 'dublin',
            'stockholm-se': 'stockholm',
            'copenhagen-dk': 'copenhagen',
            'oslo-no': 'oslo',
            'helsinki-fi': 'helsinki',
            'bratislava-sk': 'bratislava',
            'istanbul-tr': 'istanbul',
            'edinburgh-uk': 'edinburgh',
            'munich-de': 'munich',
            'venice-it': 'venice',
            'krakow-pl': 'krakow',
            'porto-pt': 'porto',
            'hamburg-de': 'hamburg',
            'seville-es': 'seville',
            'naples-it': 'naples',
            'valletta-mt': 'valletta',
            'rhodes-gr': 'rhodes',
            'sofia-bg': 'sofia',
            'riga-lv': 'riga',
            'lyon-fr': 'lyon',
            'nice-fr': 'nice',
            'dubrovnik-hr': 'dubrovnik',
            'santorini-gr': 'santorini',
            'palma-mallorca-es': 'palma-mallorca',
            'reykjavik-is': 'reykjavik',
            'innsbruck-at': 'innsbruck',
            'interlaken-ch': 'interlaken',

            // Asia
            'tokyo-jp': 'tokyo',
            'kyoto-jp': 'kyoto',
            'osaka-jp': 'osaka',
            'seoul-kr': 'seoul',
            'beijing-cn': 'beijing',
            'shanghai-cn': 'shanghai',
            'hong-kong-hk': 'hong-kong',
            'taipei-tw': 'taipei',
            'bangkok-th': 'bangkok',
            'phuket-th': 'phuket',
            'chiang-mai-th': 'chiang-mai',
            'singapore-sg': 'singapore',
            'kuala-lumpur-my': 'kuala-lumpur',
            'hanoi-vn': 'hanoi',
            'ho-chi-minh-vn': 'ho-chi-minh',
            'jakarta-id': 'jakarta',
            'bali-id': 'bali',
            'manila-ph': 'manila',
            'mumbai-in': 'mumbai',
            'new-delhi-in': 'new-delhi',
            'dubai-ae': 'dubai',
            'sapporo-jp': 'sapporo',
            'busan-kr': 'busan',
            'chengdu-cn': 'chengdu',
            'kathmandu-np': 'kathmandu',
            'colombo-lk': 'colombo',
            'almaty-kz': 'almaty',
            'tashkent-uz': 'tashkent',
            'fukuoka-jp': 'fukuoka',
            'abu-dhabi-ae': 'abu-dhabi',
            'doha-qa': 'doha',
            'tel-aviv-il': 'tel-aviv',
            'muscat-om': 'muscat',
            'ras-al-khaimah-ae': 'ras-al-khaimah',
            'male-mv': 'male',

            // Oceania
            'sydney-au': 'sydney',
            'melbourne-au': 'melbourne',
            'auckland-nz': 'auckland',
            'brisbane-au': 'brisbane',
            'perth-au': 'perth',
            'christchurch-nz': 'christchurch',
            'nadi-fj': 'nadi',
            'papeete-pf': 'papeete',
            'queenstown-nz': 'queenstown',
            'bora-bora-pf': 'bora-bora',

            // Africa
            'cape-town-za': 'cape-town',
            'marrakech-ma': 'marrakech',
            'cairo-eg': 'cairo',
            'johannesburg-za': 'johannesburg',
            'nairobi-ke': 'nairobi',
            'casablanca-ma': 'casablanca',
            'zanzibar-tz': 'zanzibar',

            // Caribbean
            'cancun-mx': 'cancun',
            'punta-cana-do': 'punta-cana',
            'nassau-bs': 'nassau',
            'san-juan-pr': 'san-juan',
            'montego-bay-jm': 'montego-bay',
            'las-palmas-es': 'las-palmas',
        };

        const redirects = [];

        // OLD FORMAT 1: /old-city-slug -> /new-city-slug
        // Example: /helsinki-fi -> /helsinki
        // This handles the slug migration from country-code suffixes
        Object.entries(oldToNewSlugMap).forEach(([oldSlug, newSlug]) => {
            // City overview page
            redirects.push({
                source: `/${oldSlug}`,
                destination: `/${newSlug}`,
                permanent: true, // 301 redirect for SEO
            });

            // Monthly pages with month names (all 12 months)
            Object.values(monthMap).forEach(monthName => {
                redirects.push({
                    source: `/${oldSlug}/${monthName}`,
                    destination: `/${newSlug}/${monthName}`,
                    permanent: true,
                });

                // Daily pages within each month (1-31)
                for (let day = 1; day <= 31; day++) {
                    const dayStr = day.toString().padStart(2, '0');
                    redirects.push({
                        source: `/${oldSlug}/${monthName}/${dayStr}`,
                        destination: `/${newSlug}/${monthName}/${dayStr}`,
                        permanent: true,
                    });
                }
            });

            // Monthly pages with numeric months (01-12)
            // Example: /marrakech-ma/12 -> /marrakech/december
            Object.entries(monthMap).forEach(([numMonth, monthName]) => {
                redirects.push({
                    source: `/${oldSlug}/${numMonth}`,
                    destination: `/${newSlug}/${monthName}`,
                    permanent: true,
                });

                // Daily pages with numeric format (MM-DD)
                // Example: /marrakech-ma/12-25 -> /marrakech/december/25
                for (let day = 1; day <= 31; day++) {
                    const dayStr = day.toString().padStart(2, '0');
                    redirects.push({
                        source: `/${oldSlug}/${numMonth}-${dayStr}`,
                        destination: `/${newSlug}/${monthName}/${dayStr}`,
                        permanent: true,
                    });
                }
            });
        });

        // OLD FORMAT 2: /city/MM-DD -> /city/monthname/DD
        // Example: /prague/07-15 -> /prague/july/15
        // Generate all 372 daily redirects (12 months × 31 days)
        Object.entries(monthMap).forEach(([numMonth, monthName]) => {
            for (let day = 1; day <= 31; day++) {
                const dayStr = day.toString().padStart(2, '0');
                redirects.push({
                    source: `/:city/${numMonth}-${dayStr}`,
                    destination: `/:city/${monthName}/${dayStr}`,
                    permanent: true, // 301 redirect for SEO
                });
            }
        });

        // OLD FORMAT 3: /city/MM -> /city/monthname
        // Example: /prague/07 -> /prague/july
        // Generate 12 monthly redirects
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
