import Link from "next/link";
// Removed Tremor imports to fix potential hydration issues
import { ArrowLeft, Thermometer, CloudRain, Sun, Wind, Calendar } from "lucide-react";
import { format } from "date-fns";

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
    const monthName = format(new Date(2024, monthNum - 1, 1), "MMMM");

    // Ensure month format matches data keys (e.g. "08")
    const monthFormatted = month.toString().padStart(2, '0');

    // Filter days for this month
    const days = Object.entries(data.days)
        .filter(([key]) => key.startsWith(`${monthFormatted}-`))
        .sort((a, b) => a[0].localeCompare(b[0])); // Sort by date

    console.log(`MonthCalendarView: city=${city}, month=${month}, daysFound=${days.length}`);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
            {/* Navbar / Breadcrumb */}
            <div className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-10 w-full">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href={`/${city}`} className="text-stone-500 hover:text-orange-600 transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-medium">Back to Year</span>
                    </Link>
                    <h1 className="text-xl font-bold font-serif">{monthName} in {data.meta.name}</h1>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-serif font-bold mb-2">Select a travel date</h2>
                    <p className="text-stone-600">
                        Detailed historical probabilities for every day in {monthName}.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {days.map(([dateKey, dayData]: [string, any]) => {
                        const dayNum = dateKey.split('-')[1];
                        const temp = dayData.stats.temp_max;
                        const rain = dayData.stats.precip_prob;

                        // Determine color
                        let bgColor = "bg-white";
                        let borderColor = "border-stone-200";
                        if (rain > 40) {
                            bgColor = "bg-slate-50";
                            borderColor = "border-slate-300";
                        } else if (temp > 28) {
                            bgColor = "bg-orange-50";
                            borderColor = "border-orange-200";
                        } else if (temp < 10) {
                            bgColor = "bg-blue-50";
                            borderColor = "border-blue-200";
                        } else {
                            bgColor = "bg-emerald-50/50";
                            borderColor = "border-emerald-200";
                        }

                        return (
                            <Link key={dateKey} href={`/${city}/${dateKey}`}>
                                <div className={`
                                    ${bgColor} border ${borderColor} 
                                    rounded-xl p-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]
                                    flex flex-col justify-between h-32
                                `}>
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-lg text-stone-700">{dayNum}</span>
                                        {/* Status Icon */}
                                        {rain > 30 ? <CloudRain className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-orange-500" />}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-stone-500"><Thermometer className="w-3 h-3 inline mr-1" /></span>
                                            <span className="font-medium">{temp}°</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-stone-500"><CloudRain className="w-3 h-3 inline mr-1" /></span>
                                            <span className={`font-medium ${rain > 30 ? 'text-blue-600' : 'text-stone-400'}`}>{rain}%</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
