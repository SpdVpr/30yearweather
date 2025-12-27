
"use client";

import { useUnit } from "@/context/UnitContext";

interface UnitToggleProps {
    variant?: "light" | "dark"; // dark = for dark backgrounds (white text), light = for light backgrounds (dark text)
}

export default function UnitToggle({ variant = "dark" }: UnitToggleProps) {
    const { unit, toggleUnit } = useUnit();

    const containerInfo = variant === "dark"
        ? "bg-white/10 border-white/20 hover:bg-white/20"
        : "bg-stone-200/50 border-stone-300 hover:bg-stone-200";

    const pillInfo = variant === "dark"
        ? "bg-white shadow-sm"
        : "bg-white shadow-md border border-stone-200";

    const activeText = "text-stone-900 opacity-100";
    const inactiveText = variant === "dark"
        ? "text-white opacity-60"
        : "text-stone-500 opacity-60 hover:opacity-100";

    return (
        <button
            onClick={toggleUnit}
            className={`flex items-center backdrop-blur-md border rounded-full px-1 py-1 relative min-h-[44px] h-10 md:h-8 w-[72px] md:w-16 transition-colors ${containerInfo}`}
            aria-label="Temperature unit: Celsius or Fahrenheit"
        >
            <span
                className={`absolute top-1.5 md:top-1 bottom-1.5 md:bottom-1 w-7 md:w-6 rounded-full transition-all duration-300 ${pillInfo} ${unit === "F" ? "left-[calc(100%-32px)] md:left-8" : "left-1"
                    }`}
                aria-hidden="true"
            />
            <span
                className={`flex-1 text-center text-sm md:text-xs font-bold transition-opacity z-10 ${unit === "C" ? activeText : inactiveText
                    }`}
            >
                °C
            </span>
            <span
                className={`flex-1 text-center text-sm md:text-xs font-bold transition-opacity z-10 ${unit === "F" ? activeText : inactiveText
                    }`}
            >
                °F
            </span>
        </button>
    );
}
