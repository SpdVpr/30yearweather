"use client";

import { Card, Metric, Text, Flex, ProgressBar } from "@tremor/react";

interface VerdictHeroProps {
    score: number;
    date: string; // MM-DD
    city: string;
}

export default function VerdictHero({ score, date, city }: VerdictHeroProps) {
    let verdict = "MAYBE";
    let color = "yellow";
    let message = "Conditions are mixed.";

    const styles = {
        emerald: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-200",
            text: "text-emerald-600"
        },
        yellow: {
            bg: "bg-yellow-500/10",
            border: "border-yellow-200",
            text: "text-yellow-600"
        },
        rose: {
            bg: "bg-rose-500/10",
            border: "border-rose-200",
            text: "text-rose-600"
        }
    };

    if (score >= 80) {
        verdict = "YES";
        color = "emerald";
        message = "Perfect conditions expected based on historical data.";
    } else if (score < 40) {
        verdict = "NO";
        color = "rose";
        message = "Historically poor conditions (rain or cold).";
    }

    const currentStyle = styles[color as keyof typeof styles];

    // Convert MM-DD to readable
    const [month, day] = date.split('-');
    const dateObj = new Date(2024, parseInt(month) - 1, parseInt(day));
    const readableDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
        <div className={`w-full py-16 px-4 ${currentStyle.bg} ${currentStyle.border} border-b flex flex-col items-center justify-center text-center`}>
            <Text className="text-lg font-medium tracking-wide text-gray-600 uppercase mb-2">
                Is {readableDate} good for a wedding in {city}?
            </Text>

            <h1 className={`text-6xl md:text-8xl font-black ${currentStyle.text} mb-6 tracking-tighter`}>
                {verdict}
            </h1>

            <div className="max-w-md w-full">
                <Flex className="mb-2">
                    <Text>Wedding Score</Text>
                    <Text className="font-bold">{score}/100</Text>
                </Flex>
                <ProgressBar value={score} color={color as any} className="mt-2" />
                <Text className="mt-4 text-gray-700 italic">
                    "{message}"
                </Text>
            </div>
        </div>
    );
}
