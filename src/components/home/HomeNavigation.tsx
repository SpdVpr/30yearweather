"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MapPin, FlaskConical, BookOpen, Info } from "lucide-react";
import UnitToggle from "@/components/UnitToggle";
import UserMenu from "@/components/UserMenu";

export default function HomeNavigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-stone-900/90 py-3 shadow-lg backdrop-blur-sm"
                    : "bg-transparent py-6 bg-gradient-to-b from-black/50 to-transparent"
                    }`}
            >
                <div className="max-w-[1800px] mx-auto px-4 md:px-12 flex justify-between items-center">
                    <nav className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden border border-white/20 shadow-lg bg-white flex items-center justify-center p-0.5">
                            <img src="/logo.svg" alt="30YearWeather - Historical Weather Forecast Logo" width="28" height="28" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-base md:text-xl font-bold tracking-tight text-white drop-shadow-md">30YearWeather<span className="hidden sm:inline">.</span></div>
                    </nav>
                    <nav className="flex items-center gap-3 md:gap-6 text-sm font-medium text-white/90">
                        {/* Desktop Navigation Links */}
                        <a href="#cities" className="hidden md:block hover:text-white hover:underline transition-all">Destinations</a>
                        <Link href="/research" className="hidden md:block hover:text-white hover:underline transition-all">Research</Link>
                        <a href="/methodology" className="hidden md:block hover:text-white hover:underline transition-all">Methodology</a>
                        <a href="/about" className="hidden md:block hover:text-white hover:underline transition-all">About</a>

                        <UnitToggle />
                        <UserMenu />

                        {/* Mobile Hamburger Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2.5 -mr-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] max-w-[85vw] z-[101] bg-stone-900 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Close button */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Close navigation menu"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Menu Links */}
                <nav className="px-4 py-2 flex flex-col gap-2">
                    <a
                        href="#cities"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all min-h-[52px]"
                    >
                        <MapPin className="w-5 h-5 text-orange-400" />
                        <span className="text-base font-medium">Destinations</span>
                    </a>
                    <Link
                        href="/research"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all min-h-[52px]"
                    >
                        <FlaskConical className="w-5 h-5 text-purple-400" />
                        <span className="text-base font-medium">Research</span>
                    </Link>
                    <a
                        href="/methodology"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all min-h-[52px]"
                    >
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <span className="text-base font-medium">Methodology</span>
                    </a>
                    <a
                        href="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all min-h-[52px]"
                    >
                        <Info className="w-5 h-5 text-emerald-400" />
                        <span className="text-base font-medium">About</span>
                    </a>
                </nav>

                {/* Brand at bottom */}
                <div className="absolute bottom-8 left-4 right-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5">
                            <img src="/logo.svg" alt="30YearWeather" width="28" height="28" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">30YearWeather</span>
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">Historical Forecast</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
