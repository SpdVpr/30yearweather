"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";

interface CityHeroProps {
    city: string;
    citySlug: string; // e.g. "prague-cz", "berlin-de"
    date: string; // Formatted date e.g. "July 15"
    tempMax: number;
    tempMin: number;
    precipProb: number;
}

export default function CityHero({ city, citySlug, date, tempMax, tempMin, precipProb }: CityHeroProps) {
    // Map city slug to hero image (Standardized naming)
    const isPng = ['tokyo-jp', 'prague-cz', 'berlin-de'].includes(citySlug);
    const heroImage = `/images/${citySlug}-hero.${isPng ? 'png' : 'webp'}`;

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

            {/* Overlay - Darker for better text readability on bright images */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

            {/* Back Button (Absolute Top Left) */}
            <Link
                href={`/${citySlug}`}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors border border-white/20"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Calendar</span>
            </Link>


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
                    className="mt-8 flex gap-8 md:gap-12"
                >
                    <div className="text-center">
                        <p className="text-3xl font-bold">{tempMax}°</p>
                        <p className="text-xs uppercase tracking-wider opacity-70">High</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">{tempMin}°</p>
                        <p className="text-xs uppercase tracking-wider opacity-70">Low</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">{precipProb}%</p>
                        <p className="text-xs uppercase tracking-wider opacity-70">Rain</p>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 1.5,
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
            >
                <ArrowDown className="w-6 h-6" />
            </motion.div>
        </div>
    );
}
