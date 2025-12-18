import IntelligentSearch from "@/components/search/IntelligentSearch";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Smart Travel Finder | 30YearWeather - Find Your Perfect Destination',
    description: 'Not sure where to go? Use our AI-powered travel finder to discover the perfect holiday destination based on weather preferences, crowds, price, and activities. Analyze 30 years of historical weather data to find your ideal trip.',
    keywords: ['travel finder', 'weather search', 'holiday destination', 'best weather', 'warmest places in winter', 'avoid rain', 'smart travel search', 'historical weather data'],
    openGraph: {
        title: 'Smart Travel Finder | Find Your Perfect Trip',
        description: 'Discover your ideal holiday spot based on real historical weather data, crowd levels, and prices.',
        type: 'website',
        url: 'https://30yearweather.com/finder',
        siteName: '30 Year Weather',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Smart Travel Finder | 30YearWeather',
        description: 'Find the perfect place to go based on your weather preferences.',
    }
};

export default function FinderPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Design Your <span className="text-orange-600">Perfect Trip</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Tell us what you love, and our AI will find the best match from 30 years of historical weather data.
                    </p>
                </div>

                <IntelligentSearch />
            </div>
        </main>
    );
}
