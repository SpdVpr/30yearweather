"use client";

import { useUnit } from "@/context/UnitContext";

interface TemperatureProps {
    value: number;
    round?: boolean;
}

export default function Temperature({ value, round = true }: TemperatureProps) {
    const { unit, convertTemp } = useUnit();
    const converted = convertTemp(value);
    const display = round ? Math.round(converted) : converted.toFixed(1);

    return <>{display}°{unit}</>;
}
