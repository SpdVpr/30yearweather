
"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeNavigationProps {
    prevUrl: string;
    nextUrl: string;
    children: React.ReactNode;
    className?: string;
}

export default function SwipeNavigation({ prevUrl, nextUrl, children, className }: SwipeNavigationProps) {
    const router = useRouter();
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const distanceX = touchStartX.current - touchEndX;
        const distanceY = touchStartY.current - touchEndY;

        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
        const isSignificantSwipe = Math.abs(distanceX) > minSwipeDistance;

        if (isHorizontalSwipe && isSignificantSwipe) {
            // Check if we are swiping specifically on an interactive element like a chart/slider?
            // Usually charts stop propagation, so this should be fine.
            if (distanceX > 0) {
                // Swiped Left -> Go Next
                router.push(nextUrl);
            } else {
                // Swiped Right -> Go Prev
                router.push(prevUrl);
            }
        }

        // Reset
        touchStartX.current = null;
        touchStartY.current = null;
    };

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className={className}
        >
            {children}

            {/* Floating Navigation Arrows - Visible on mobile/touch mainly, but useful for all */}
            <button
                onClick={() => router.push(prevUrl)}
                className="fixed left-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-full border border-stone-200 text-stone-600 opacity-60 hover:opacity-100 transition-opacity md:hidden"
                aria-label="Previous Day"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={() => router.push(nextUrl)}
                className="fixed right-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-full border border-stone-200 text-stone-600 opacity-60 hover:opacity-100 transition-opacity md:hidden"
                aria-label="Next Day"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
