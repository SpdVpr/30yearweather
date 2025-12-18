import { NextResponse } from 'next/server';
import { getAllCities } from '@/lib/data';

// Your IndexNow Key
const KEY = '30yearweather-indexnow-key';
const HOST = '30yearweather.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function POST() {
    try {
        const citySlugs = await getAllCities();
        const urls = [
            `https://${HOST}/`,
            ...citySlugs.map(slug => `https://${HOST}/${slug}`)
        ];

        // We can submit up to 10k URLs per batch. We likely have fewer.
        const body = {
            host: HOST,
            key: KEY,
            keyLocation: `https://${HOST}/${KEY}.txt`,
            urlList: urls
        };

        const response = await fetch(INDEXNOW_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to submit to IndexNow', details: await response.text() }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            message: `Submitted ${urls.length} URLs to IndexNow`,
            submittedUrls: urls.length
        });

    } catch (error) {
        console.error('IndexNow Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Send a POST request to trigger IndexNow submission.",
        setup: {
            host: HOST,
            key: KEY,
            keyLocation: `https://${HOST}/${KEY}.txt`
        }
    });
}
