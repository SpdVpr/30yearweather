import Link from "next/link";
import { Sun, Cloud, CloudRain, CloudSun, Snowflake } from "lucide-react";
import { format } from "date-fns";
import Temperature from "@/components/Temperature";

export default function MonthCalendarView({
    city,
    month,
    data
}: {
    city: string;
    month: string;
    data: any
}) {
    const monthNum = parseInt(month);
    const monthFormatted = month.toString().padStart(2, '0');

    // Filter days for this month
    const days = Object.entries(data.days)
        .filter(([key]) => key.startsWith(`${monthFormatted}-`))
        .sort((a, b) => a[0].localeCompare(b[0]));

    // Helper to get status, colors and icon
    const getDayInfo = (temp: number, rain: number) => {
        if (rain > 50) return {
            status: "Rain",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            Icon: CloudRain,
            iconColor: "text-blue-500"
        };
        if (rain > 30) return {
            status: "Cloudy",
            bgColor: "bg-slate-100",
            borderColor: "border-slate-300",
            Icon: Cloud,
            iconColor: "text-slate-400"
        };
        if (temp > 28) return {
            status: "Sunny",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            Icon: Sun,
            iconColor: "text-orange-400"
        };
        if (temp < 10) return {
            status: "Cold",
            bgColor: "bg-cyan-50",
            borderColor: "border-cyan-200",
            Icon: Snowflake,
            iconColor: "text-cyan-500"
        };
        if (temp > 22 && rain < 20) return {
            status: "Sunny",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            Icon: Sun,
            iconColor: "text-yellow-500"
        };
        return {
            status: "Partly",
            bgColor: "bg-stone-50",
            borderColor: "border-stone-200",
            Icon: CloudSun,
            iconColor: "text-amber-400"
        };
    };

    const monthSlug = format(new Date(2024, monthNum - 1, 1), "MMMM").toLowerCase();

    return (
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
            {days.map(([dateKey, dayData]: [string, any]) => {
                const dayNum = dateKey.split('-')[1];
                const temp = Math.round(dayData.stats.temp_max);
                const rain = Math.round(dayData.stats.precip_prob);
                const { status, bgColor, borderColor, Icon, iconColor } = getDayInfo(temp, rain);

                return (
                    <Link key={dateKey} href={`/${city}/${monthSlug}/${dayNum}`} aria-label={`View weather for day ${parseInt(dayNum)}`}>
                        <div className={`
                            ${bgColor} border ${borderColor} 
                            rounded-xl p-2 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.03]
                            flex flex-col items-center h-28 sm:h-32
                        `}>
                            {/* Day number */}
                            <span className="text-xs sm:text-sm font-bold text-stone-700 self-start">{parseInt(dayNum)}</span>

                            {/* Big weather icon */}
                            <div className="flex-1 flex items-center justify-center">
                                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${iconColor}`} strokeWidth={1.5} />
                            </div>

                            {/* Status label */}
                            <span className="text-[9px] sm:text-[10px] text-stone-500 mb-1">{status}</span>

                            {/* Temperature and rain */}
                            <div className="flex items-center justify-between w-full text-xs sm:text-sm">
                                <span className="font-bold text-stone-800"><Temperature value={temp} /></span>
                                <span className={`${rain > 30 ? 'text-blue-500 font-medium' : 'text-stone-400'}`}>
                                    {rain}%
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
