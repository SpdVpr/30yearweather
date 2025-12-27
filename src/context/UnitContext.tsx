"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

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
    const { user, userProfile, updateUserProfile } = useAuth();

    useEffect(() => {
        const savedUnit = localStorage.getItem("tempUnit") as Unit;
        if (savedUnit && (savedUnit === "C" || savedUnit === "F")) {
            setUnit(savedUnit);
        }
        setMounted(true);
    }, []);

    // Sync from profile when loaded
    useEffect(() => {
        if (userProfile?.temperatureUnit) {
            setUnit(userProfile.temperatureUnit);
            // Also sync to local storage for consistency
            localStorage.setItem("tempUnit", userProfile.temperatureUnit);
        }
    }, [userProfile]);

    const toggleUnit = () => {
        setUnit((prev) => {
            const newUnit = prev === "C" ? "F" : "C";
            localStorage.setItem("tempUnit", newUnit);

            // If logged in, save to profile
            if (user) {
                updateUserProfile({ temperatureUnit: newUnit }).catch(err =>
                    console.error("Failed to save unit preference:", err)
                );
            }
            return newUnit;
        });
    };

    const convertTemp = (tempC: number) => {
        if (unit === "C") return tempC;
        return Math.round((tempC * 9) / 5 + 32);
    };

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
