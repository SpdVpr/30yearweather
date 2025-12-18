"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

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
            <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group transition-transform hover:scale-[1.02]">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-white flex items-center justify-center p-0.5 group-hover:shadow-orange-200 transition-all">
                            <img
                                src="/favicon_io/android-chrome-192x192.png"
                                alt="30YearWeather Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-stone-900 leading-none">30YearWeather<span className="text-orange-600">.</span></span>
                            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5 leading-none">Historical Forecast</span>
                        </div>
                    </Link>

                    {/* Navigace a Breadcrumb */}
                    {breadcrumb && (
                        <>
                            {/* MOBILE: Ponecháno podle preferencí uživatele (čára + ikona) */}
                            <div className="flex md:hidden items-center">
                                <div className="h-6 w-[1px] bg-stone-200 shrink-0 mx-6 xs:block hidden" />
                                <div className="flex items-center gap-2 overflow-hidden pl-2">
                                    {breadcrumb.href && (
                                        <Link
                                            href={breadcrumb.href}
                                            className="p-2 hover:bg-orange-50 rounded-full transition-all text-stone-400 hover:text-orange-600 shrink-0"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </Link>
                                    )}
                                    <div className="flex flex-col overflow-hidden py-1">
                                        <span className="text-sm font-bold text-stone-900 truncate tracking-tight leading-tight">
                                            {breadcrumb.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* DESKTOP: Profi Dashboard Layout (Logičtější UX pro široké obrazovky) */}
                            <div className="hidden md:flex items-center gap-6 ml-8 pl-8 border-l border-stone-100 h-10">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                                        {breadcrumb.href && (
                                            <Link href={breadcrumb.href} className="hover:text-orange-600 transition-colors flex items-center gap-1 group/back">
                                                <ArrowLeft className="w-3 h-3 group-hover/back:-translate-x-0.5 transition-transform" />
                                                Return
                                            </Link>
                                        )}
                                        {!breadcrumb.href && <span>Historical Data</span>}
                                        <span className="text-stone-200">/</span>
                                        <span className="text-stone-300">{breadcrumb.sublabel || "Forecast"}</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-stone-950 font-serif leading-none tracking-tight">
                                        {breadcrumb.label}
                                    </h2>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <Link
                        href="/finder"
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-orange-600 text-white text-[11px] md:text-xs font-black hover:bg-orange-700 transition-colors shadow-sm hover:shadow-orange-500/20"
                    >
                        <Search className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden xs:inline">Smart Finder</span>
                        <span className="xs:hidden">Finder</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
