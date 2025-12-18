import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '30YearWeather - Long-Range Weather Forecasts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    const cities = [
        'Prague', 'Paris', 'Rome', 'Tokyo', 'Bali', 'Dubai',
        'London', 'Barcelona', 'New York', 'Sydney', 'Bangkok', 'Amsterdam'
    ];

    return new ImageResponse(
        (
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #44403c 100%)',
                padding: '60px',
            }}>
                {/* Header badge */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        background: 'rgba(234, 88, 12, 0.15)',
                        border: '1px solid rgba(234, 88, 12, 0.3)',
                        padding: '10px 24px',
                        borderRadius: '30px',
                        fontSize: '18px',
                        color: '#f97316',
                        fontWeight: '600',
                    }}>
                        🛰️ 30 Years of NASA Satellite Data
                    </div>
                </div>

                {/* Main content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        marginBottom: '24px',
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 20px 40px rgba(234, 88, 12, 0.3)',
                        }}>
                            <span style={{ fontSize: '40px', color: 'white', fontWeight: 'bold' }}>30</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: '72px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 16px 0',
                        textAlign: 'center',
                    }}>
                        30YearWeather
                    </h1>

                    {/* Subtitle */}
                    <div style={{
                        fontSize: '32px',
                        color: '#d6d3d1',
                        textAlign: 'center',
                        marginBottom: '8px',
                    }}>
                        Long-Range Weather Forecasts
                    </div>
                    <div style={{
                        fontSize: '24px',
                        color: '#78716c',
                        textAlign: 'center',
                    }}>
                        365-Day Predictions for 84+ Cities Worldwide
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex',
                        gap: '40px',
                        marginTop: '40px',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '20px 36px',
                            borderRadius: '16px',
                        }}>
                            <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#f97316' }}>84+</span>
                            <span style={{ fontSize: '16px', color: '#a8a29e', marginTop: '4px' }}>Cities</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '20px 36px',
                            borderRadius: '16px',
                        }}>
                            <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#22c55e' }}>30</span>
                            <span style={{ fontSize: '16px', color: '#a8a29e', marginTop: '4px' }}>Years Data</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '20px 36px',
                            borderRadius: '16px',
                        }}>
                            <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#60a5fa' }}>366</span>
                            <span style={{ fontSize: '16px', color: '#a8a29e', marginTop: '4px' }}>Days/City</span>
                        </div>
                    </div>
                </div>

                {/* City list */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '24px',
                }}>
                    {cities.map((city, i) => (
                        <span
                            key={i}
                            style={{
                                fontSize: '16px',
                                color: '#78716c',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '6px 16px',
                                borderRadius: '20px',
                            }}
                        >
                            {city}
                        </span>
                    ))}
                    <span style={{
                        fontSize: '16px',
                        color: '#f97316',
                        background: 'rgba(234, 88, 12, 0.1)',
                        padding: '6px 16px',
                        borderRadius: '20px',
                    }}>
                        +72 more
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
