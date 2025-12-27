"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UnitToggle from "@/components/UnitToggle";
import UserMenu from "@/components/UserMenu";

export default function HomeNavigation() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-stone-900/90 py-3 shadow-lg backdrop-blur-sm"
                    : "bg-transparent py-6 bg-gradient-to-b from-black/50 to-transparent"
                }`}
        >
            <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
                <nav className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-lg bg-white flex items-center justify-center p-0.5">
                        <img src="/logo.svg" alt="30YearWeather - Historical Weather Forecast Logo" width="28" height="28" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-bold tracking-tight text-white drop-shadow-md">30YearWeather.</div>
                </nav>
                <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium text-white/90">
                    <a href="#cities" className="hidden md:block hover:text-white hover:underline transition-all">Destinations</a>
                    <Link href="/research" className="hidden md:block hover:text-white hover:underline transition-all">Research</Link>
                    <a href="/methodology" className="hidden md:block hover:text-white hover:underline transition-all">Methodology</a>
                    <a href="/about" className="hidden md:block hover:text-white hover:underline transition-all">About</a>
                    <UnitToggle />
                    <UserMenu />
                </nav>
            </div>
        </header>
    );
}
