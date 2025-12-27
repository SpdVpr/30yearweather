"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

interface MobileBreadcrumbProps {
    cityName: string;
    citySlug: string;
    monthName: string;
    monthSlug: string;
    day?: number;
    prevUrl?: string;
    nextUrl?: string;
    prevLabel?: string;
    nextLabel?: string;
}

export default function MobileBreadcrumb({
    cityName,
    citySlug,
    monthName,
    monthSlug,
    day,
    prevUrl,
    nextUrl,
    prevLabel,
    nextLabel
}: MobileBreadcrumbProps) {
    return (
        <nav className="md:hidden bg-white border-b border-stone-100 px-3 py-2" aria-label="Breadcrumb navigation">
            <div className="flex items-center justify-between gap-2">
                {/* Left: Previous navigation */}
                {prevUrl ? (
                    <Link
                        href={prevUrl}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors text-stone-600 shrink-0"
                        aria-label={`Go to ${prevLabel || 'previous'}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-xs font-medium max-w-[50px] truncate">{prevLabel || 'Prev'}</span>
                    </Link>
                ) : (
                    <div className="w-16" /> // Spacer
                )}

                {/* Center: Breadcrumb trail */}
                <div className="flex items-center gap-1 text-xs overflow-hidden flex-1 justify-center min-w-0">
                    <Link
                        href={`/${citySlug}`}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors shrink-0 ${!monthSlug
                                ? 'bg-orange-100 text-orange-700 font-semibold'
                                : 'hover:bg-orange-50 text-stone-600 hover:text-orange-600'
                            }`}
                    >
                        <MapPin className="w-3 h-3" />
                        <span className="font-medium truncate max-w-[80px]">{cityName}</span>
                    </Link>

                    {monthSlug && (
                        <>
                            <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />

                            <Link
                                href={`/${citySlug}/${monthSlug}`}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors shrink-0 ${day
                                        ? 'hover:bg-orange-50 text-stone-600 hover:text-orange-600'
                                        : 'bg-orange-100 text-orange-700 font-semibold'
                                    }`}
                            >
                                <Calendar className="w-3 h-3" />
                                <span className="truncate max-w-[60px]">{monthName}</span>
                            </Link>
                        </>
                    )}

                    {day && (
                        <>
                            <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
                            <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 font-semibold shrink-0">
                                {day}
                            </span>
                        </>
                    )}
                </div>

                {/* Right: Next navigation */}
                {nextUrl ? (
                    <Link
                        href={nextUrl}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors text-stone-600 shrink-0"
                        aria-label={`Go to ${nextLabel || 'next'}`}
                    >
                        <span className="text-xs font-medium max-w-[50px] truncate">{nextLabel || 'Next'}</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <div className="w-16" /> // Spacer
                )}
            </div>
        </nav>
    );
}
