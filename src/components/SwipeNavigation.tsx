
"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                router.push(prevUrl);
            } else if (e.key === 'ArrowRight') {
                router.push(nextUrl);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router, prevUrl, nextUrl]);

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className={className}
        >
            {children}

            {/* Floating Navigation Arrows - Optimized for mobile touch (48px targets) */}
            <button
                onClick={() => router.push(prevUrl)}
                className="fixed left-3 md:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 md:p-3 min-w-[48px] min-h-[48px] md:min-w-0 md:min-h-0 bg-white/90 backdrop-blur-md shadow-xl rounded-full border border-stone-200/50 text-stone-900 transition-all hover:scale-110 active:scale-95 active:bg-white flex items-center justify-center"
                style={{ left: 'max(12px, env(safe-area-inset-left, 12px))' }}
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => router.push(nextUrl)}
                className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 md:p-3 min-w-[48px] min-h-[48px] md:min-w-0 md:min-h-0 bg-white/90 backdrop-blur-md shadow-xl rounded-full border border-stone-200/50 text-stone-900 transition-all hover:scale-110 active:scale-95 active:bg-white flex items-center justify-center"
                style={{ right: 'max(12px, env(safe-area-inset-right, 12px))' }}
                aria-label="Next Page"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}
