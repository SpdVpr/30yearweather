import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (singleton)
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
    }
}

const db = getFirestore();

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    if (!slug) {
        return NextResponse.json(
            { error: 'Location slug is required' },
            { status: 400 }
        );
    }

    try {
        // Fetch from Firestore
        const docRef = db.collection('tourism').doc(slug);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json(
                {
                    error: 'Tourism data not found for this location',
                    slug,
                    fallback: true
                },
                { status: 404 }
            );
        }

        const data = doc.data();

        // Return with cache headers (24 hours)
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
            },
        });

    } catch (error) {
        console.error('Error fetching tourism data:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch tourism data',
                fallback: true
            },
            { status: 500 }
        );
    }
}
