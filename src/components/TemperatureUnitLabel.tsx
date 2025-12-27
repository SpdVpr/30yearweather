"use client";

import { useUnit } from "@/context/UnitContext";

export default function TemperatureUnitLabel() {
    const { unit } = useUnit();
    return <>(°{unit})</>;
}
