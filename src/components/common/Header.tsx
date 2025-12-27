"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import UnitToggle from "@/components/UnitToggle";
import UserMenu from "../UserMenu";

interface HeaderProps {
    breadcrumb?: {
        label: string;
        href?: string;
        sublabel?: string;
    };
}

export default function Header({ breadcrumb }: HeaderProps) {
    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-3 md:px-12 h-14 md:h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 group transition-transform hover:scale-[1.02]">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-white flex items-center justify-center p-0.5 group-hover:shadow-orange-200 transition-all">
                            <img
                                src="/logo.svg"
                                alt="30YearWeather"
                                width={28}
                                height={28}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {/* Hide brand text on mobile when breadcrumb exists */}
                        <div className={`${breadcrumb ? 'hidden md:flex' : 'hidden sm:flex'} flex-col`}>
                            <span className="text-sm font-bold tracking-tight text-stone-900 leading-none">30YearWeather<span className="text-orange-600">.</span></span>
                            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5 leading-none">Historical Forecast</span>
                        </div>
                    </Link>

                    {/* MOBILE: Compact breadcrumb - just the city/page name */}
                    {breadcrumb && (
                        <div className="flex md:hidden items-center overflow-hidden">
                            <div className="h-5 w-[1px] bg-stone-200 shrink-0 mx-2" />
                            <span className="text-sm font-bold text-stone-800 truncate max-w-[120px]">
                                {breadcrumb.label}
                            </span>
                        </div>
                    )}

                    {/* DESKTOP: Full breadcrumb with back button */}
                    {breadcrumb && (
                        <div className="hidden md:flex items-center gap-6 ml-4 pl-6 border-l border-stone-100 h-12">
                            <div className="flex flex-col py-1">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                                    {breadcrumb.href && (
                                        <Link
                                            href={breadcrumb.href}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all font-bold text-[11px] uppercase tracking-wide group/back"
                                        >
                                            <ArrowLeft className="w-3 h-3 group-hover/back:-translate-x-0.5 transition-transform" />
                                            Back
                                        </Link>
                                    )}
                                    {!breadcrumb.href && <span>Historical Data</span>}
                                    <span className="text-stone-200">/</span>
                                    <span className="text-stone-300">{breadcrumb.sublabel || "Forecast"}</span>
                                </div>
                                <span className="text-lg font-bold text-stone-950 font-serif leading-tight tracking-tight">
                                    {breadcrumb.label}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {/* Search - icon only on mobile, full on desktop */}
                    <Link
                        href="/#cities"
                        className="flex items-center justify-center gap-2 h-9 md:h-10 w-9 md:w-auto md:px-4 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors"
                        aria-label="Search cities"
                    >
                        <Search className="w-4 h-4 text-stone-500" />
                        <span className="hidden md:inline text-sm text-stone-500 font-medium">Search cities...</span>
                    </Link>

                    {/* Unit Toggle */}
                    <UnitToggle variant="light" />

                    {/* User Menu */}
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
