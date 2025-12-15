"use client";
import { Card, Title, Text } from "@tremor/react";

interface HeatmapCalendarProps {
    days: Record<string, { scores: { wedding: number } }>;
}

export default function HeatmapCalendar({ days }: HeatmapCalendarProps) {
    // Generate months structure
    const months = Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const monthStr = monthNum.toString().padStart(2, '0');
        const monthName = new Date(2024, i, 1).toLocaleString('en-US', { month: 'short' });

        // Get all days for this month
        const daysInMonth = Object.keys(days)
            .filter(d => d.startsWith(monthStr))
            .sort();

        return {
            name: monthName,
            days: daysInMonth.map(d => ({
                date: d,
                score: days[d].scores.wedding
            }))
        };
    });

    const getColor = (score: number) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-emerald-300";
        if (score >= 40) return "bg-yellow-300";
        if (score >= 20) return "bg-orange-300";
        return "bg-rose-400";
    };

    return (
        <Card className="mt-6">
            <Title>Annual Wedding Suitability</Title>
            <Text>Historical view of best dates.</Text>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {months.map((m) => (
                    <div key={m.name} className="border p-4 rounded-lg">
                        <h3 className="font-bold mb-2">{m.name}</h3>
                        <div className="grid grid-cols-7 gap-1">
                            {m.days.map((d) => (
                                <a
                                    key={d.date}
                                    href={`/prague-cz/${d.date}`}
                                    className={`h-6 w-6 rounded-sm ${getColor(d.score)} hover:scale-125 transition-transform cursor-pointer`}
                                    title={`${d.date}: ${d.score}%`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
