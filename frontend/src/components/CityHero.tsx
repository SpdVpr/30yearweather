"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface CityHeroProps {
    city: string;
    citySlug: string; // e.g. "prague-cz", "berlin-de"
    date: string; // Formatted date e.g. "July 15"
    tempMax: number;
    tempMin: number;
    precipProb: number;
}

export default function CityHero({ city, citySlug, date, tempMax, tempMin, precipProb }: CityHeroProps) {
    // Map city slug to hero image
    const heroImage =
        citySlug === 'prague-cz' ? '/images/prague-hero.webp' :
            citySlug === 'berlin-de' ? '/images/berlin-de-hero.webp' :
                '/images/prague-hero.webp'; // Fallback

    return (
        <div className="relative h-[70vh] w-full overflow-hidden">
            {/* Background Image */}
            <Image
                src={heroImage}
                alt={`${city} View`}
                fill
                className="object-cover"
                priority
            />

            {/* Overlay - Gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                        ✨ Based on 30 Years of Historical Data
                    </div>
                    <h2 className="text-xl md:text-2xl font-light uppercase tracking-widest mb-2">
                        Historical Weather Analysis
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl">
                        {date}
                    </h1>
                    <p className="text-2xl md:text-3xl font-light opacity-90">
                        {city}
                    </p>
                </motion.div>

                {/* Key Metrics Snippet */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-8 flex gap-8 backdrop-blur-md bg-white/10 px-8 py-4 rounded-full border border-white/20"
                >
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider opacity-70">Day</span>
                        <span className="text-2xl font-semibold">{tempMax}°</span>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider opacity-70">Night</span>
                        <span className="text-2xl font-semibold">{tempMin}°</span>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider opacity-70">Rain</span>
                        <span className="text-2xl font-semibold">{precipProb}%</span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
            >
                <ArrowDown className="w-8 h-8" />
            </motion.div>
        </div>
    );
}

