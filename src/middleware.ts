import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
    // === 1. ADMIN PROTECTION (Basic Auth) ===
    if (request.nextUrl.pathname.startsWith('/admin')) {
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

// Config to match API routes AND Admin
export const config = {
    matcher: ['/api/:path*', '/admin/:path*'],
};
