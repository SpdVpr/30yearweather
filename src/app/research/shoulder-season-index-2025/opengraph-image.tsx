import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Shoulder Season Index 2025 - Research Study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
                position: 'relative',
                fontFamily: 'system-ui, sans-serif',
            }}>
                {/* Decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />

                {/* Content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: 60,
                    position: 'relative',
                    zIndex: 10,
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'rgba(249, 115, 22, 0.2)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        borderRadius: 9999,
                        padding: '8px 20px',
                        marginBottom: 24,
                    }}>
                        <span style={{ fontSize: 18 }}>📊</span>
                        <span style={{ color: '#fb923c', fontSize: 16, fontWeight: 600 }}>Research Study</span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 72,
                        fontWeight: 900,
                        color: 'white',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }}>
                        Shoulder Season Index
                    </h1>
                    <div style={{
                        fontSize: 72,
                        fontWeight: 900,
                        background: 'linear-gradient(90deg, #f97316, #fbbf24)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        margin: 0,
                    }}>
                        2025
                    </div>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 28,
                        color: '#a8a29e',
                        textAlign: 'center',
                        marginTop: 16,
                        marginBottom: 32,
                    }}>
                        Best Time to Visit 96 European Destinations
                    </p>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex',
                        gap: 48,
                        marginTop: 16,
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>30</span>
                            <span style={{ fontSize: 14, color: '#78716c', textTransform: 'uppercase', letterSpacing: 2 }}>Years Data</span>
                        </div>
                        <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>96</span>
                            <span style={{ fontSize: 14, color: '#78716c', textTransform: 'uppercase', letterSpacing: 2 }}>Destinations</span>
                        </div>
                        <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>10M+</span>
                            <span style={{ fontSize: 14, color: '#78716c', textTransform: 'uppercase', letterSpacing: 2 }}>Data Points</span>
                        </div>
                    </div>

                    {/* Season icons */}
                    <div style={{
                        display: 'flex',
                        gap: 32,
                        marginTop: 40,
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(236, 72, 153, 0.15)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            borderRadius: 12,
                            padding: '10px 20px',
                        }}>
                            <span style={{ fontSize: 24 }}>🌸</span>
                            <span style={{ color: '#f472b6', fontSize: 18, fontWeight: 600 }}>Spring</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(249, 115, 22, 0.15)',
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                            borderRadius: 12,
                            padding: '10px 20px',
                        }}>
                            <span style={{ fontSize: 24 }}>🍂</span>
                            <span style={{ color: '#fb923c', fontSize: 18, fontWeight: 600 }}>Fall</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 16, color: '#78716c' }}>
                        30YearWeather.com/research
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
