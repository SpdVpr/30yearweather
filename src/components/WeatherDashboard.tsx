"use client";
import { useState, useEffect } from "react";
import { Card, AreaChart, Title, Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";
import StatCard from "./StatCard";
import SmartSuitcase from "./SmartSuitcase";
import PlanYourDay from "./PlanYourDay";
import HistoricalRecords from "./HistoricalRecords";
import AstronomyCard from "./AstronomyCard";
import ExtremesCard from "./ExtremesCard";
import TourismScoreCard from "./TourismScoreCard";
import HealthImpactCard from "./HealthImpactCard";
import AltitudeWarningCard from "./AltitudeWarningCard";
import SafetyProfileCard from "./SafetyProfileCard";
import { Sun, CloudRain, Wind, Thermometer, Cloud, Heart, Droplets, Snowflake, Gauge, Info, ThermometerSun, Activity } from "lucide-react";
import { DayData, GeoInfo, SafetyProfile } from "@/lib/data";
import { calculateTourismScores, fetchTourismData, TourismDataset, getTourismInsights, getTourismAttribution } from "@/lib/tourism";
import { calculateFeelsLike, getFeelsLikeDescription, getTempEmoji, getReliabilityInfo } from "@/lib/weather-utils";
import BetterAlternatives from "./BetterAlternatives";
import CompareCities from "./CompareCities";

interface AlternativeDateData {
    dateSlug: string;
    dateFormatted: string;
    score: number;
    tempMax: number;
    precipProb: number;
    improvement: number;
}

interface CityComparisonData {
    citySlug: string;
    cityName: string;
    country: string;
    tempMax: number;
    precipProb: number;
    score: number;
}

interface WeatherDashboardProps {
    dayData: DayData;
    lat: number;
    lon: number;
    dateId: string;
    citySlug: string;
    cityName: string;
    geoInfo?: GeoInfo;
    safetyProfile?: SafetyProfile;
    timezoneOffset?: number;
    alternativeDates?: AlternativeDateData[];
    cityComparisons?: CityComparisonData[];
}

export default function WeatherDashboard({ dayData, lat, lon, dateId, citySlug, cityName, geoInfo, safetyProfile, timezoneOffset = 0, alternativeDates, cityComparisons }: WeatherDashboardProps) {
    const { stats, scores, clothing, historical_records, pressure_stats, health_impact, weather_condition } = dayData;

    // Tourism Data Fetching
    const [tourismData, setTourismData] = useState<TourismDataset | null>(null);

    useEffect(() => {
        if (citySlug) {
            fetchTourismData(citySlug).then(setTourismData);
        }
    }, [citySlug]);

    const tourismScores = calculateTourismScores(dayData, dateId, tourismData);
    const month = parseInt(dateId.split('-')[0]);
    const dateFormatted = new Date(2024, month - 1, parseInt(dateId.split('-')[1])).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    const tourismInsights = getTourismInsights(tourismData, month);
    const tourismAttribution = getTourismAttribution(tourismData);

    // Helper text generators
    const getVerdict = () => {
        if (stats.precip_prob > 50) return "Rainy & Overcast";
        if (stats.temp_max < 5) return "Cold & Crisp";
        if (stats.temp_max > 25) return "Warm & Sunny";
        return "Mild & Comfortable";
    };

    const getBeaufortDescription = (speed: number) => {
        if (speed < 5) return "Calm breeze";
        if (speed < 12) return "Light breeze";
        if (speed < 20) return "Gentle breeze";
        if (speed < 29) return "Moderate wind";
        if (speed < 39) return "Fresh breeze";
        return "Strong wind";
    };

    const getHumidityDescription = (humidity: number) => {
        if (humidity < 30) return "Dry air";
        if (humidity < 60) return "Comfortable";
        if (humidity < 70) return "Slightly humid";
        return "Humid / Damp"; // In winter typically 'Damp', summer 'Muggy'
    };

    const getSunshineDescription = (hours: number | undefined) => {
        if (hours === undefined) return "No data";
        if (hours < 3) return "Mostly cloudy";
        if (hours < 6) return "Partly sunny";
        return "Sunny day";
    };

    const precipType = (stats.temp_max < 2 || (stats.snowfall_cm || 0) > 0) ? "Snow" : "Rain";
    const isSnowy = precipType === "Snow";
    const precipAmount = isSnowy ? (stats.snowfall_cm || 0) : stats.precip_mm;
    const precipUnit = isSnowy ? "cm" : "mm";
    const precipLabel = isSnowy ? "Accumulation" : "Volume";

    // Feels Like calculation
    const feelsLikeMax = calculateFeelsLike(stats.temp_max, stats.wind_kmh, stats.humidity_percent || 50);
    const feelsLikeMin = calculateFeelsLike(stats.temp_min, stats.wind_kmh * 0.7, stats.humidity_percent || 50);
    const hasSignificantFeelsLike = Math.abs(feelsLikeMax - stats.temp_max) >= 2;
    const feelsLikeDesc = getFeelsLikeDescription(stats.temp_max, feelsLikeMax);
    const feelsLikeEmoji = getTempEmoji(feelsLikeMax);

    // Reliability Score calculation
    const reliabilityInfo = getReliabilityInfo(
        scores.reliability,
        pressure_stats?.volatility,
        pressure_stats?.std_dev ?? undefined
    );

    // Chart Data
    const chartData = historical_records
        ? historical_records.map(r => ({
            Year: r.year.toString(),
            "Max Temp": r.temp_max,
            "Min Temp": r.temp_min
        })).reverse()
        : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

            {/* 1. VERDICT / SUMMARY */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">
                        Weather Verdict for {cityName} on {dateFormatted}
                    </h2>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                    <p className="text-lg text-slate-700 font-medium">
                        "{getVerdict()}. Expect average highs of {stats.temp_max}°C. {stats.precip_prob}% chance of {precipType.toLowerCase()}."
                    </p>
                </div>
            </section>



            {/* 2. PLAN YOUR DAY (Clothing + Key Stats) */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    What to wear in {cityName}?
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Clothing Column - 1/3 Width */}
                    <div className="h-full">
                        <SmartSuitcase clothing={clothing} />
                    </div>

                    {/* Key Metrics Grid - 2/3 Width
                        Mobile: 2 columns, Desktop: 3 columns for better use of space
                    */}
                    <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard
                            title="Average High"
                            value={`${stats.temp_max}°C`}
                            subtext="Daytime Peak"
                            icon={<Thermometer className="w-5 h-5 text-rose-500" />}
                            tempValue={stats.temp_max}
                            delay={0}
                        />
                        <StatCard
                            title="Average Low"
                            value={`${stats.temp_min}°C`}
                            subtext="Nighttime Low"
                            icon={<Thermometer className="w-5 h-5 text-blue-500" />}
                            tempValue={stats.temp_min}
                            delay={1}
                        />
                        {/* Feels Like - Always show */}
                        <StatCard
                            title="Feels Like"
                            value={`${feelsLikeMax}°C`}
                            subtext={`${feelsLikeEmoji} ${feelsLikeDesc}`}
                            icon={<ThermometerSun className="w-5 h-5 text-amber-500" />}
                            tempValue={feelsLikeMax}
                            delay={2}
                        />
                        <StatCard
                            title={`${precipType} Chance`}
                            value={`${stats.precip_prob}%`}
                            subtext={`Avg ${stats.precip_mm}mm if it ${precipType.toLowerCase()}s`}
                            icon={isSnowy ? <Snowflake className="w-5 h-5 text-cyan-500" /> : <CloudRain className="w-5 h-5 text-blue-500" />}
                            color="blue"
                            delay={3}
                        />
                        {/* Show Snowfall if relevant, otherwise Cloud Cover */}
                        {(isSnowy || (stats.snowfall_cm || 0) > 0) ? (
                            <StatCard
                                title="Snowfall"
                                value={`${stats.snowfall_cm?.toFixed(1) ?? 0} cm`}
                                subtext={`~${stats.precip_prob}% chance`}
                                icon={<Snowflake className="w-5 h-5 text-cyan-500" />}
                                color="blue"
                                delay={4}
                            />
                        ) : (
                            <StatCard
                                title="Cloud Cover"
                                value={`${stats.clouds_percent}%`}
                                subtext={weather_condition?.description}
                                icon={<Cloud className="w-5 h-5 text-slate-500" />}
                                color="slate"
                                delay={4}
                            />
                        )}
                        {/* Reliability Score - 6th card */}
                        <StatCard
                            title="Reliability"
                            value={`${reliabilityInfo.score}%`}
                            subtext={`${reliabilityInfo.emoji} ${reliabilityInfo.label}`}
                            icon={<Activity className={`w-5 h-5 ${reliabilityInfo.colorClass}`} />}
                            color={reliabilityInfo.score >= 60 ? "emerald" : reliabilityInfo.score >= 45 ? "amber" : "orange"}
                            delay={5}
                        />
                    </div>
                </div>

                {/* Plan Your Day Timeline */}
                <div className="mt-8">
                    <PlanYourDay
                        tempMax={stats.temp_max}
                        tempMin={stats.temp_min}
                        precipProb={stats.precip_prob}
                        isRainy={stats.precip_prob > 50}
                    />
                </div>
            </section>

            {/* 3. ATMOSPHERIC & SOLAR (Consolidated to remove gaps) */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Atmospheric Conditions
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart - Wider (2/3) for better visibility */}
                    <div className="lg:col-span-2 h-full">
                        <AstronomyCard date={dateId} lat={lat} lon={lon} timezoneOffset={timezoneOffset} />
                    </div>

                    {/* Conditions Stack - 1/3 Width 
                        Mobile Optimization: 
                        - Mobile: grid-cols-2 (2 items per row)
                        - Tablet (sm): grid-cols-3 (1 row of 3)
                        - Desktop (lg): grid-cols-1 (stack)
                    */}
                    <div className="space-y-4 h-full flex flex-col justify-between">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4 flex-1">
                            <StatCard
                                title="Wind Speed"
                                value={`${stats.wind_kmh} km/h`}
                                subtext={getBeaufortDescription(stats.wind_kmh)}
                                icon={<Wind className="w-5 h-5 text-slate-500" />}
                                color="slate"
                                delay={0}
                            />
                            <StatCard
                                title="Sunshine"
                                value={`${stats.sunshine_hours?.toFixed(1) ?? '--'} hrs`}
                                subtext="Direct Sun (Cloud-free)"
                                icon={<Sun className="w-5 h-5 text-amber-500" />}
                                color="amber"
                                delay={1}
                            />
                            <StatCard
                                title="Humidity"
                                value={`${stats.humidity_percent ?? 75}%`}
                                subtext={getHumidityDescription(stats.humidity_percent ?? 75)}
                                icon={<Droplets className="w-5 h-5 text-indigo-500" />}
                                color="blue"
                                delay={2}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. TRAVEL INTELLIGENCE (Bento Grid Layout) */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Travel & Wellbeing Intelligence
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Row: Tourism (2/3) + Health (1/3) */}
                    <div className="lg:col-span-2 h-full">
                        <TourismScoreCard
                            scores={tourismScores}
                            insights={tourismInsights}
                            attribution={tourismAttribution}
                        />
                    </div>
                    {health_impact && pressure_stats && (
                        <div className="lg:col-span-1 h-full">
                            <HealthImpactCard
                                healthImpact={health_impact}
                                pressureStats={pressure_stats}
                            />
                        </div>
                    )}

                    {/* Bottom Row: Safety (Full Width) */}
                    {safetyProfile && (
                        <div className="lg:col-span-3">
                            <SafetyProfileCard
                                safetyProfile={safetyProfile}
                                cityName={cityName}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* 5. HISTORY (2/3 Chart, 1/3 Extremes) */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Historical Weather Archive (2010 - 2024)
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-full">
                        <Card className="p-6 rounded-xl shadow-sm ring-1 ring-gray-200 h-full">
                            <Title>Temperature History</Title>
                            <AreaChart
                                className="h-72 mt-4"
                                data={chartData}
                                index="Year"
                                categories={["Max Temp", "Min Temp"]}
                                colors={["orange", "blue"]}
                                valueFormatter={(number) => `${number}°C`}
                                showAnimation={true}
                            />
                        </Card>
                    </div>
                    <div className="h-full">
                        {historical_records && <ExtremesCard records={historical_records} />}
                    </div>
                </div>
            </section>

            {/* 6. BETTER ALTERNATIVES (moved from top) */}
            {alternativeDates && alternativeDates.length > 0 && alternativeDates.some(a => a.score > scores.wedding) && (
                <section>
                    <BetterAlternatives
                        currentDateSlug={dateId}
                        currentScore={scores.wedding}
                        citySlug={citySlug}
                        alternatives={alternativeDates}
                    />
                </section>
            )}

            {/* 7. COMPARE CITIES (show other destinations for same date) */}
            {cityComparisons && cityComparisons.length > 0 && (
                <section>
                    <CompareCities
                        currentCity={citySlug}
                        dateSlug={dateId}
                        dateFormatted={dateFormatted}
                        comparisons={cityComparisons}
                    />
                </section>
            )}

            {/* 8. FAQ */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
                <AccordionList>
                    <Accordion>
                        <AccordionHeader className="text-sm font-medium">Will it snow in {cityName} on {dateFormatted}?</AccordionHeader>
                        <AccordionBody className="text-slate-600 text-sm leading-relaxed">
                            Historically, there is a {stats.precip_prob}% chance of precipitation on this day.
                            {isSnowy
                                ? ` Given the low temperatures (${stats.temp_min}°C - ${stats.temp_max}°C), snow is likely if precip occurs.`
                                : ` Temperatures are generally too warm for snow (${stats.temp_min}°C - ${stats.temp_max}°C). Expect rain if anything.`}
                        </AccordionBody>
                    </Accordion>
                    <Accordion>
                        <AccordionHeader className="text-sm font-medium">Is it windy in {cityName} in {month === 12 || month < 3 ? 'Winter' : 'this season'}?</AccordionHeader>
                        <AccordionBody className="text-slate-600 text-sm leading-relaxed">
                            The average wind speed on {dateFormatted} is {stats.wind_kmh} km/h.
                            {stats.wind_kmh > 20 ? " It can be quite breezy, so a windbreaker is recommended." : " It is generally calm."}
                        </AccordionBody>
                    </Accordion>
                    <Accordion>
                        <AccordionHeader className="text-sm font-medium">Is {cityName} safe for tourists?</AccordionHeader>
                        <AccordionBody className="text-slate-600 text-sm leading-relaxed">
                            {safetyProfile ? `The seismic risk is classified as ${safetyProfile.seismic.risk_level}. ` : "General safety data is positive. "}
                            {safetyProfile?.seismic.risk_level === 'High' ? "Visitors should be aware of earthquake protocols." : "It is geologically stable."}
                        </AccordionBody>
                    </Accordion>
                </AccordionList>
            </section>

        </div>
    );
}
