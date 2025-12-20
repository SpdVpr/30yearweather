import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimitMap = new Map();

// Map old slugs (with country codes) to new slugs (without country codes)
const OLD_TO_NEW_SLUG: Record<string, string> = {
    'new-york-us': 'new-york', 'los-angeles-us': 'los-angeles', 'san-francisco-us': 'san-francisco',
    'miami-us': 'miami', 'vancouver-ca': 'vancouver', 'toronto-ca': 'toronto', 'mexico-city-mx': 'mexico-city',
    'chicago-us': 'chicago', 'boston-us': 'boston', 'las-vegas-us': 'las-vegas', 'honolulu-us': 'honolulu',
    'montreal-ca': 'montreal', 'calgary-ca': 'calgary', 'new-orleans-us': 'new-orleans', 'whistler-ca': 'whistler',
    'rio-de-janeiro-br': 'rio-de-janeiro', 'buenos-aires-ar': 'buenos-aires', 'lima-pe': 'lima',
    'santiago-cl': 'santiago', 'bogota-co': 'bogota', 'sao-paulo-br': 'sao-paulo', 'quito-ec': 'quito',
    'cusco-pe': 'cusco', 'cartagena-co': 'cartagena', 'prague-cz': 'prague', 'berlin-de': 'berlin',
    'london-uk': 'london', 'paris-fr': 'paris', 'rome-it': 'rome', 'barcelona-es': 'barcelona',
    'vienna-at': 'vienna', 'zurich-ch': 'zurich', 'athens-gr': 'athens', 'amsterdam-nl': 'amsterdam',
    'madrid-es': 'madrid', 'brussels-be': 'brussels', 'warsaw-pl': 'warsaw', 'budapest-hu': 'budapest',
    'lisbon-pt': 'lisbon', 'dublin-ie': 'dublin', 'stockholm-se': 'stockholm', 'copenhagen-dk': 'copenhagen',
    'oslo-no': 'oslo', 'helsinki-fi': 'helsinki', 'bratislava-sk': 'bratislava', 'istanbul-tr': 'istanbul',
    'edinburgh-uk': 'edinburgh', 'munich-de': 'munich', 'venice-it': 'venice', 'krakow-pl': 'krakow',
    'porto-pt': 'porto', 'hamburg-de': 'hamburg', 'seville-es': 'seville', 'naples-it': 'naples',
    'valletta-mt': 'valletta', 'rhodes-gr': 'rhodes', 'sofia-bg': 'sofia', 'riga-lv': 'riga',
    'lyon-fr': 'lyon', 'nice-fr': 'nice', 'dubrovnik-hr': 'dubrovnik', 'santorini-gr': 'santorini',
    'palma-mallorca-es': 'palma-mallorca', 'reykjavik-is': 'reykjavik', 'innsbruck-at': 'innsbruck',
    'interlaken-ch': 'interlaken', 'tokyo-jp': 'tokyo', 'kyoto-jp': 'kyoto', 'osaka-jp': 'osaka',
    'seoul-kr': 'seoul', 'beijing-cn': 'beijing', 'shanghai-cn': 'shanghai', 'hong-kong-hk': 'hong-kong',
    'taipei-tw': 'taipei', 'bangkok-th': 'bangkok', 'phuket-th': 'phuket', 'chiang-mai-th': 'chiang-mai',
    'singapore-sg': 'singapore', 'kuala-lumpur-my': 'kuala-lumpur', 'hanoi-vn': 'hanoi',
    'ho-chi-minh-vn': 'ho-chi-minh', 'jakarta-id': 'jakarta', 'bali-id': 'bali', 'manila-ph': 'manila',
    'mumbai-in': 'mumbai', 'new-delhi-in': 'new-delhi', 'dubai-ae': 'dubai', 'sapporo-jp': 'sapporo',
    'busan-kr': 'busan', 'chengdu-cn': 'chengdu', 'kathmandu-np': 'kathmandu', 'colombo-lk': 'colombo',
    'almaty-kz': 'almaty', 'tashkent-uz': 'tashkent', 'fukuoka-jp': 'fukuoka', 'abu-dhabi-ae': 'abu-dhabi',
    'doha-qa': 'doha', 'tel-aviv-il': 'tel-aviv', 'muscat-om': 'muscat', 'ras-al-khaimah-ae': 'ras-al-khaimah',
    'male-mv': 'male', 'sydney-au': 'sydney', 'melbourne-au': 'melbourne', 'auckland-nz': 'auckland',
    'brisbane-au': 'brisbane', 'perth-au': 'perth', 'christchurch-nz': 'christchurch', 'nadi-fj': 'nadi',
    'papeete-pf': 'papeete', 'queenstown-nz': 'queenstown', 'bora-bora-pf': 'bora-bora',
    'cape-town-za': 'cape-town', 'marrakech-ma': 'marrakech', 'cairo-eg': 'cairo',
    'johannesburg-za': 'johannesburg', 'nairobi-ke': 'nairobi', 'casablanca-ma': 'casablanca',
    'zanzibar-tz': 'zanzibar', 'cancun-mx': 'cancun', 'punta-cana-do': 'punta-cana', 'nassau-bs': 'nassau',
    'san-juan-pr': 'san-juan', 'montego-bay-jm': 'montego-bay', 'las-palmas-es': 'las-palmas',
};

// Map numeric months to month names
const MONTH_MAP: Record<string, string> = {
    '01': 'january', '02': 'february', '03': 'march', '04': 'april',
    '05': 'may', '06': 'june', '07': 'july', '08': 'august',
    '09': 'september', '10': 'october', '11': 'november', '12': 'december',
};

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // === 0. URL REDIRECTS FOR OLD SLUGS ===
    // Handle old city slugs with country codes (e.g., /helsinki-fi -> /helsinki)
    const pathParts = pathname.split('/').filter(Boolean);

    if (pathParts.length > 0) {
        const firstPart = pathParts[0];

        // Check if first part is an old slug
        if (OLD_TO_NEW_SLUG[firstPart]) {
            const newSlug = OLD_TO_NEW_SLUG[firstPart];
            let newPath = `/${newSlug}`;

            // Handle month and day parts
            if (pathParts.length > 1) {
                const secondPart = pathParts[1];

                // Check if it's a numeric month (01-12)
                if (MONTH_MAP[secondPart]) {
                    newPath += `/${MONTH_MAP[secondPart]}`;
                    if (pathParts.length > 2) {
                        newPath += `/${pathParts[2]}`;
                    }
                }
                // Check if it's MM-DD format
                else if (/^\d{2}-\d{2}$/.test(secondPart)) {
                    const [month, day] = secondPart.split('-');
                    if (MONTH_MAP[month]) {
                        newPath += `/${MONTH_MAP[month]}/${day}`;
                    }
                }
                // Otherwise keep the rest of the path as-is
                else {
                    newPath += `/${pathParts.slice(1).join('/')}`;
                }
            }

            return NextResponse.redirect(new URL(newPath, request.url), 301);
        }

        // Handle numeric month format on new slugs (e.g., /prague/07 -> /prague/july)
        if (pathParts.length === 2 && MONTH_MAP[pathParts[1]]) {
            const newPath = `/${pathParts[0]}/${MONTH_MAP[pathParts[1]]}`;
            return NextResponse.redirect(new URL(newPath, request.url), 301);
        }

        // Handle MM-DD format on new slugs (e.g., /prague/07-15 -> /prague/july/15)
        if (pathParts.length === 2 && /^\d{2}-\d{2}$/.test(pathParts[1])) {
            const [month, day] = pathParts[1].split('-');
            if (MONTH_MAP[month]) {
                const newPath = `/${pathParts[0]}/${MONTH_MAP[month]}/${day}`;
                return NextResponse.redirect(new URL(newPath, request.url), 301);
            }
        }
    }

    // === 1. ADMIN PROTECTION (Basic Auth) ===
    if (pathname.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization');

        if (authHeader) {
            // Basic Auth format: "Basic base64(user:pass)"
            const authValue = authHeader.split(' ')[1];
            // Decode base64
            const [user, pwd] = atob(authValue).split(':');

            // Check against ENV variable
            const validPassword = process.env.ADMIN_PASSWORD || 'secret123';

            // User can be anything, password is what matters
            if (pwd === validPassword) {
                return NextResponse.next();
            }
        }

        // Return 401 to trigger browser login prompt
        return new NextResponse('Auth Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
            },
        });
    }

    // === 2. API RATE LIMITING ===
    // Only apply to /api routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        const ip = request.ip || '127.0.0.1';
        const LIMIT = 30; // Max requests per window
        const WINDOW_MS = 60 * 1000; // 1 minute window

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, { count: 0, startTime: Date.now() });
        }

        const clientData = rateLimitMap.get(ip);
        const now = Date.now();

        if (now - clientData.startTime > WINDOW_MS) {
            clientData.count = 0;
            clientData.startTime = now;
        }

        clientData.count++;

        console.log(`[API Access] ${new Date().toISOString()} | IP: ${ip} | Req: ${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`);

        if (clientData.count > LIMIT) {
            console.warn(`[API BLOCKED] Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                {
                    error: "Too Many Requests",
                    message: "Rate limit exceeded. Please slow down. For higher limits, contact support."
                },
                { status: 429 }
            );
        }

        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', LIMIT.toString());
        response.headers.set('X-RateLimit-Remaining', (LIMIT - clientData.count).toString());

        return response;
    }

    return NextResponse.next();
}

// Config to match all routes (for redirects), API routes, and Admin
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
