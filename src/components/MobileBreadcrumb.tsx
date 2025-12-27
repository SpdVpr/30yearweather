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
        <nav className="md:hidden bg-white border-b border-stone-100 px-2 py-1.5" aria-label="Breadcrumb navigation">
            <div className="flex items-center justify-between gap-1">
                {/* Left: Previous navigation */}
                {prevUrl ? (
                    <Link
                        href={prevUrl}
                        className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-stone-200 transition-colors text-stone-600 shrink-0 min-h-[44px] min-w-[44px]"
                        aria-label={`Go to ${prevLabel || 'previous'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium max-w-[50px] truncate">{prevLabel || 'Prev'}</span>
                    </Link>
                ) : (
                    <div className="w-[44px]" /> // Spacer matching button width
                )}

                {/* Center: Breadcrumb trail */}
                <div className="flex items-center gap-0.5 text-sm overflow-hidden flex-1 justify-center min-w-0">
                    <Link
                        href={`/${citySlug}`}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-colors shrink-0 min-h-[40px] ${!monthSlug
                            ? 'bg-orange-100 text-orange-700 font-semibold'
                            : 'hover:bg-orange-50 text-stone-600 hover:text-orange-600 active:bg-orange-100'
                            }`}
                    >
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-medium truncate max-w-[100px]">{cityName}</span>
                    </Link>

                    {monthSlug && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />

                            <Link
                                href={`/${citySlug}/${monthSlug}`}
                                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-colors shrink-0 min-h-[40px] ${day
                                    ? 'hover:bg-orange-50 text-stone-600 hover:text-orange-600 active:bg-orange-100'
                                    : 'bg-orange-100 text-orange-700 font-semibold'
                                    }`}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[70px]">{monthName}</span>
                            </Link>
                        </>
                    )}

                    {day && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                            <span className="px-3 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold shrink-0 min-h-[40px] flex items-center">
                                {day}
                            </span>
                        </>
                    )}
                </div>

                {/* Right: Next navigation */}
                {nextUrl ? (
                    <Link
                        href={nextUrl}
                        className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-stone-200 transition-colors text-stone-600 shrink-0 min-h-[44px] min-w-[44px]"
                        aria-label={`Go to ${nextLabel || 'next'}`}
                    >
                        <span className="text-sm font-medium max-w-[50px] truncate">{nextLabel || 'Next'}</span>
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <div className="w-[44px]" /> // Spacer matching button width
                )}
            </div>
        </nav>
    );
}
