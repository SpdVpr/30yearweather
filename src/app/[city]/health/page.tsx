import { Metadata } from "next";
import { getCityData } from "@/lib/data";
import { ArrowLeft, Stethoscope, ShieldCheck, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, Title, Text, Badge, Divider } from "@tremor/react";

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
    const data = await getCityData(params.city);
    if (!data) return { title: "Health Information Not Found" };
    return {
        title: `Travel Health & Vaccinations for ${data.meta.name} | 30YearWeather`,
        description: `Official CDC health recommendations, required vaccinations, and disease prevention for ${data.meta.name}, ${data.meta.country}.`
    };
}

export default async function HealthPage({ params }: { params: { city: string } }) {
    const data = await getCityData(params.city);
    if (!data) return <div>City not found</div>;

    const health = data.meta.health_info;
    const cityName = data.meta.name;
    const countryName = data.meta.country;

    if (!health) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <Stethoscope className="w-16 h-16 text-stone-300 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-stone-800 mb-4">No specific health data available</h1>
                <p className="text-stone-600 mb-8">We don't have detailed health recommendations for {cityName} at this moment. Always consult your doctor before traveling.</p>
                <Link href={`/${params.city}`} className="text-blue-600 font-semibold flex items-center justify-center gap-2 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to {cityName}
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-stone-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-stone-200 py-12 px-4 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <Link href={`/${params.city}`} className="text-stone-500 hover:text-stone-800 flex items-center gap-2 mb-6 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to {cityName} Weather
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Stethoscope className="w-8 h-8 text-emerald-600" />
                                <h1 className="text-4xl font-black text-stone-900 tracking-tight">Travel Health Advisory</h1>
                            </div>
                            <p className="text-xl text-stone-500 font-medium">{cityName}, {countryName}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Source Authority</p>
                                <p className="text-sm font-bold text-stone-800">CDC Travelers' Health</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Vaccinations */}
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-2xl font-black text-stone-800 tracking-tight">Vaccines and Medicines</h2>
                            <Badge color="emerald">Expert Verified</Badge>
                        </div>

                        <div className="space-y-4">
                            {health.vaccines.map((v, i) => {
                                const isRequired = v.recommendation.toLowerCase().includes("required") && !v.recommendation.toLowerCase().includes("not required");
                                return (
                                    <Card key={i} className={`p-0 overflow-hidden border-2 transition-all hover:shadow-lg ${isRequired ? 'border-red-100 shadow-red-50' : 'border-stone-100 shadow-sm'}`}>
                                        <div className={`px-6 py-4 flex items-center justify-between ${isRequired ? 'bg-red-50/50' : 'bg-white'}`}>
                                            <div className="flex items-center gap-3">
                                                {isRequired ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                                <h3 className="text-lg font-black text-stone-800 uppercase tracking-wide">{v.disease}</h3>
                                            </div>
                                            {isRequired && <Badge color="red" size="sm">MANDATORY / REQUIRED</Badge>}
                                        </div>
                                        <div className="px-6 py-4 bg-white border-t border-stone-100">
                                            <p className="text-stone-600 leading-relaxed text-sm">{v.recommendation}</p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {health.non_vaccine_diseases && health.non_vaccine_diseases.length > 0 && (
                        <section className="mt-12">
                            <div className="flex items-center gap-2 mb-6">
                                <h2 className="text-2xl font-black text-stone-800 tracking-tight">Non-Vaccine Diseases</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {health.non_vaccine_diseases.map((d, i) => (
                                    <Card key={i} className="border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="font-black text-stone-800 mb-2 uppercase text-xs tracking-widest">{d.disease}</h3>
                                        <p className="text-sm text-stone-500 leading-relaxed">{d.advice}</p>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: General Advice */}
                <div className="space-y-6">
                    <Card className="bg-blue-600 text-white border-none shadow-xl rounded-3xl p-8 sticky top-8">
                        <Info className="w-10 h-10 mb-6 opacity-30" />
                        <h3 className="text-2xl font-black mb-4 leading-tight">General Travel Advice</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-200" />
                                <span className="text-sm text-blue-50 font-medium">Be up to date on routine vaccinations.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-200" />
                                <span className="text-sm text-blue-50 font-medium">See a doctor 4-6 weeks before travel.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-200" />
                                <span className="text-sm text-blue-50 font-medium">Carry a small first-aid kit.</span>
                            </li>
                        </ul>
                        <Divider className="bg-blue-500 my-8" />
                        <div className="bg-blue-700/50 p-4 rounded-2xl">
                            <p className="text-xs text-blue-100 leading-relaxed italic">
                                "The information on this page is for general awareness. Please seek professional medical help for your specific travel needs."
                            </p>
                        </div>
                    </Card>

                    {health.notices && health.notices.length > 0 && (
                        <Card className="bg-amber-50 border-amber-200 border-2 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-4 text-amber-700">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-black uppercase text-xs tracking-widest">Global Travel Notices</h3>
                            </div>
                            <div className="space-y-3">
                                {health.notices.map((n, i) => (
                                    <p key={i} className="text-sm text-amber-800/80 leading-relaxed font-medium">
                                        • {n}
                                    </p>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </main>
    );
}
