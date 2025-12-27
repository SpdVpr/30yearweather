"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { calculateFeelsLike, getTempEmoji } from "@/lib/weather-utils";
import UnitToggle from "@/components/UnitToggle";
import { useUnit } from "@/context/UnitContext";
import FavoriteButton from "@/components/FavoriteButton";

interface CityHeroProps {
    city: string;
    citySlug: string;
    country: string;
    date: string;
    tempMax: number;
    tempMin: number;
    precipProb: number;
    dateSlug?: string;
    windKmh?: number;
    humidity?: number;
    imageAlt?: string;
    seaTemp?: number;
}

export default function CityHero({ city, citySlug, country, date, tempMax, tempMin, precipProb, dateSlug, windKmh = 10, humidity = 50, imageAlt, seaTemp }: CityHeroProps) {
    const { unit, convertTemp } = useUnit();
    // Calculate feels-like temperature (keep feelsLikeMax in C for emoji logic first)
    const feelsLikeMaxC = calculateFeelsLike(tempMax, windKmh, humidity);
    const feelsLikeEmoji = getTempEmoji(feelsLikeMaxC);

    // Convert for display
    const displayMax = convertTemp(tempMax);
    const displayMin = convertTemp(tempMin);
    const displayFeelsLike = convertTemp(feelsLikeMaxC);
    // All hero images are now WebP (optimized from PNG)
    const heroImage = `/images/${citySlug}-hero.webp`;

    // Logic for Next/Prev Day - REFACTORED FOR CLEAN URLS
    const [monthStr, dayStr] = (dateSlug || "01-01").split('-');
    const currentYear = 2024; // Leap year for full coverage
    const currentObj = new Date(currentYear, parseInt(monthStr) - 1, parseInt(dayStr));

    // Current Month Slug (for Back button)
    const currentMonthSlug = format(currentObj, 'MMMM').toLowerCase();

    // Prev Day URL components
    const prevObj = new Date(currentObj);
    prevObj.setDate(prevObj.getDate() - 1);
    const prevMonthSlug = format(prevObj, 'MMMM').toLowerCase();
    const prevDay = prevObj.getDate();

    // Next Day URL components
    const nextObj = new Date(currentObj);
    nextObj.setDate(nextObj.getDate() + 1);
    const nextMonthSlug = format(nextObj, 'MMMM').toLowerCase();
    const nextDay = nextObj.getDate();

    return (
        <div className="relative min-h-[500px] h-[70vh] w-full overflow-hidden group pt-16 md:pt-24">
            {/* Background Image */}
            <Image
                src={heroImage}
                alt={imageAlt || `${city} View`}
                fill
                className="object-cover"
                priority
                quality={60}
                sizes="(max-width: 768px) 100vw, 100vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />




            {/* Navigation handled by parent SwipeNavigation */}


            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-sm md:text-base font-medium tracking-widest mb-3 uppercase text-emerald-300">
                        Historical Weather Analysis
                    </h2>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-xl leading-tight max-w-4xl mx-auto">
                        Is {date} a Good Time to Visit {city}?
                    </h1>
                    <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
                        Based on 30 years of historical data, we have the answer.
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
                        <p className="text-3xl font-bold">{displayMax}°{unit}</p>
                        <p className="text-xs uppercase tracking-wider opacity-70">High</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">{displayMin}°{unit}</p>
                        <p className="text-xs uppercase tracking-wider opacity-70">Low</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">{precipProb}%</p>
                        <p className="text-xs uppercase tracking-wider opacity-70">Rain</p>
                    </div>
                </motion.div>

                {/* Feels Like indicator - always show */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-4 flex items-center gap-3"
                >
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <p className="text-sm">
                            {feelsLikeEmoji} Feels like <span className="font-bold">{displayFeelsLike}°{unit}</span>
                            {feelsLikeMaxC < tempMax - 0.5 && " (wind chill)"}
                            {feelsLikeMaxC > tempMax + 0.5 && " (humidity)"}
                        </p>
                    </div>
                    <FavoriteButton
                        type="day"
                        citySlug={citySlug}
                        cityName={city}
                        country={country}
                        monthSlug={currentMonthSlug}
                        monthName={format(currentObj, 'MMMM')}
                        day={currentObj.getDate()}
                        tempMax={tempMax}
                        tempMin={tempMin}
                        precipProb={precipProb}
                        seaTemp={seaTemp}
                    />
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
