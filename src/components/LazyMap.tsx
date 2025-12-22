"use client";

import { useState } from "react";
import { Map, Loader2, Navigation, Move } from "lucide-react";

interface LazyMapProps {
    lat: number;
    lon: number;
    name: string;
}

export default function LazyMap({ lat, lon, name }: LazyMapProps) {
    const [mobileMapLoaded, setMobileMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleMobileLoad = () => {
        setIsLoading(true);
        setMobileMapLoaded(true);
    };

    const mapSrc = `https://maps.google.com/maps?q=${lat},${lon}&hl=en&z=10&output=embed`;

    // Stylish Map Placeholder (Abstract representation)
    const MapPlaceholder = () => (
        <div
            className="w-full h-full min-h-[280px] bg-[#f0f0f0] flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
            onClick={handleMobileLoad}
        >
            {/* Abstract Map Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                        linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                        linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            />

            {/* City Center Representation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-40 h-40 rounded-full border-4 border-stone-300"></div>
                <div className="w-20 h-20 rounded-full border-4 border-stone-300 absolute"></div>
            </div>

            {/* Central Pin & CTA */}
            <div className="relative z-10 flex flex-col items-center gap-2 transform transition-transform duration-500 group-hover:scale-105">
                <div className="relative">
                    <div className="w-4 h-4 bg-orange-500/30 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 animate-ping" />
                    <MapPinFilled className="w-12 h-12 text-orange-600 drop-shadow-md relative z-10" />
                </div>

                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-stone-200 mt-2">
                    <p className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <Move className="w-3 h-3 text-stone-400" />
                        Tap to Explore Map
                    </p>
                </div>
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 text-[10px] text-stone-500 bg-white/50 px-2 py-1 rounded">
                Interactive Google Map
            </div>
        </div>
    );

    return (
        <>
            {/* DESKTOP: Always load iframe immediately (as requested) */}
            <div className="hidden md:block w-full h-full min-h-[280px] bg-stone-100 relative rounded-xl overflow-hidden">
                <iframe
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    title={`Map of ${name}`}
                    src={mapSrc}
                ></iframe>
            </div>

            {/* MOBILE: Lazy load with placeholder */}
            <div className="md:hidden w-full h-full min-h-[280px] bg-stone-100 relative rounded-xl overflow-hidden">
                {!mobileMapLoaded ? (
                    <MapPlaceholder />
                ) : (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-10 pointer-events-none">
                                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                            </div>
                        )}
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 0 }}
                            loading="eager"
                            allowFullScreen
                            title={`Map of ${name}`}
                            src={mapSrc}
                            onLoad={() => setIsLoading(false)}
                        ></iframe>
                    </>
                )}
            </div>
        </>
    );
}

// Custom Pin Icon Component for visuals
function MapPinFilled({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
    );
}
