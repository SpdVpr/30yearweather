
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Unit = "C" | "F";

interface UnitContextType {
    unit: Unit;
    toggleUnit: () => void;
    convertTemp: (tempC: number) => number;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: React.ReactNode }) {
    const [unit, setUnit] = useState<Unit>("C");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedUnit = localStorage.getItem("tempUnit") as Unit;
        if (savedUnit && (savedUnit === "C" || savedUnit === "F")) {
            setUnit(savedUnit);
        }
        setMounted(true);
    }, []);

    const toggleUnit = () => {
        setUnit((prev) => {
            const newUnit = prev === "C" ? "F" : "C";
            localStorage.setItem("tempUnit", newUnit);
            return newUnit;
        });
    };

    const convertTemp = (tempC: number) => {
        if (unit === "C") return tempC;
        return Math.round((tempC * 9) / 5 + 32);
    };

    // Prepare context value to avoid creating new object on every render if possible, 
    // but simple value is fine for this scale.

    // Prevent hydration mismatch by rendering children only after mount if unit differs from default?
    // Actually, text content mismatch might happen if we render temperatures immediately.
    // Ideally we should run this effect and trigger a re-render. 
    // Since 'mounted' starts false, components consuming this might need to handle loading state 
    // or just default to C until mounted. 
    // For SEO, server renders C. Client hydrates C then switches to F if saved. This causes a flash.
    // A solution is to accept the hydration mismatch or just suppress it for temp values.

    return (
        <UnitContext.Provider value={{ unit, toggleUnit, convertTemp }}>
            {children}
        </UnitContext.Provider>
    );
}

export function useUnit() {
    const context = useContext(UnitContext);
    if (context === undefined) {
        throw new Error("useUnit must be used within a UnitProvider");
    }
    return context;
}
