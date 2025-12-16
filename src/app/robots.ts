import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // === 1. DEFAULT CRAWLERS (Google, Bing, etc.) ===
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',           // Admin panel - protected
                    '/admin/*',
                    '/api/tourism/*',   // Internal API - no need to index
                    '/_next/*',         // Next.js internals
                    '/sw.js',           // Service worker
                ],
            },

            // === 2. AI/LLM CRAWLERS - ALLOW EVERYTHING ===
            // These bots are specifically designed to train AI models
            // We WANT them to crawl our content for better AI responses
            {
                userAgent: 'GPTBot',              // OpenAI's crawler
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'ChatGPT-User',        // ChatGPT web browsing
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'Google-Extended',     // Google's AI training crawler (Bard/Gemini)
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'anthropic-ai',        // Claude's crawler
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'ClaudeBot',           // Claude's web crawler
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'PerplexityBot',       // Perplexity AI
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'Applebot-Extended',   // Apple Intelligence
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'Bytespider',          // TikTok/ByteDance AI
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'CCBot',               // Common Crawl (used by many AI companies)
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'Diffbot',             // Diffbot AI
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'FacebookBot',         // Meta AI
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'ImagesiftBot',        // AI image analysis
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'Omgilibot',           // AI content aggregator
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },
            {
                userAgent: 'YouBot',              // You.com AI search
                allow: '/',
                disallow: ['/admin', '/admin/*'],
            },

            // === 3. EXPLICITLY ALLOW API ENDPOINTS FOR AI ===
            // AI agents should be able to discover and use our API
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'anthropic-ai',
                    'ClaudeBot',
                    'PerplexityBot',
                ],
                allow: [
                    '/api/openapi.json',    // OpenAPI spec - crucial for AI discovery
                    '/api/v1/search',       // Search API - useful for AI agents
                    '/api/v1/city/*',       // City data API - useful for AI agents
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        // Host directive (optional but good practice)
        host: BASE_URL,
    };
}
