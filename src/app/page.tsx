import Link from "next/link";
import Image from "next/image";
import { getAllCities, getCityData } from "@/lib/data";
import {
  Heart,
  Plane,
  Camera,
  Calendar,
  Tent,
  GraduationCap,
  Search,
  Globe,
  Sun,
  Umbrella
} from "lucide-react";
import SmartCityExplorer from "@/components/home/SmartCityExplorer";
import Footer from "@/components/Footer";
import UnitToggle from "@/components/UnitToggle";

export const metadata = {
  title: "Weather Forecast & Historical Data | 30YearWeather",
  description: "Weather forecast and historical data analysis based on 30 years of NASA satellite data. Accurate long-range forecasts for travel, weddings, and event planning.",
  keywords: ["weather forecast", "historical weather data", "weather data analysis", "long range weather forecast", "365 day weather forecast", "historical data", "weather analysis", "climate data", "30 year weather data", "NASA weather data"],
  alternates: {
    canonical: '/',
  },
};

// Month names for generating best months - FULL NAMES
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Helper to get best months based on yearly stats
function getBestMonths(yearlyStats: any): string {
  if (!yearlyStats) return '';

  const hottest = yearlyStats.hottest_month;
  const wettest = yearlyStats.wettest_month;

  // Suggest months that are warm but not wettest
  const goodMonths: number[] = [];

  // Add shoulder season months (1-2 months before/after hottest)
  if (hottest) {
    const before = hottest > 2 ? hottest - 2 : hottest + 10;
    const after = hottest < 11 ? hottest + 2 : hottest - 10;

    if (before !== wettest) goodMonths.push(before);
    if (hottest !== wettest) goodMonths.push(hottest);
    if (after !== wettest) goodMonths.push(after);
  }

  // Take first 2-3 good months
  const selectedMonths = [...new Set(goodMonths)].slice(0, 2);
  if (selectedMonths.length === 0) return '';

  return selectedMonths.map(m => MONTH_NAMES[m - 1]).join(' & ');
}

// Helper to calculate average rain probability from days data
function getAverageRainRisk(days: any): number {
  if (!days) return 30; // Default

  const dayValues = Object.values(days) as any[];
  const totalRain = dayValues.reduce((sum, day) => sum + (day.stats?.precip_prob || 0), 0);
  return Math.round(totalRain / dayValues.length);
}

// Helper to get average temperature
function getAverageTemp(yearlyStats: any): number {
  return yearlyStats?.avg_temp_annual || 18;
}

// Helper to calculate total annual rainfall from days data
function getAnnualRainfall(days: any): number {
  if (!days) return 800; // Default estimate

  const dayValues = Object.values(days) as any[];
  const totalRainfall = dayValues.reduce((sum, day) => sum + (day.stats?.precip_mm || 0), 0);
  return Math.round(totalRainfall);
}

// Helper to calculate average wave height from marine data
function getAverageWaveHeight(days: any): number | undefined {
  if (!days) return undefined;

  const dayValues = Object.values(days) as any[];
  const marineDays = dayValues.filter(day => day.marine?.wave_height !== undefined);

  if (marineDays.length === 0) return undefined;

  const totalWave = marineDays.reduce((sum, day) => sum + (day.marine?.wave_height || 0), 0);
  return Math.round(totalWave / marineDays.length * 10) / 10; // Round to 1 decimal
}

// Helper to calculate average water temperature from marine data
function getAverageWaterTemp(days: any): number | undefined {
  if (!days) return undefined;

  const dayValues = Object.values(days) as any[];
  const marineDays = dayValues.filter(day => day.marine?.water_temp !== undefined);

  if (marineDays.length === 0) return undefined;

  const totalTemp = marineDays.reduce((sum, day) => sum + (day.marine?.water_temp || 0), 0);
  return Math.round(totalTemp / marineDays.length);
}

// Helper to calculate average wedding/outdoor event score from days data
function getAverageWeddingScore(days: any): number {
  if (!days) return 50; // Default

  const dayValues = Object.values(days) as any[];
  const weddingDays = dayValues.filter(day => day.scores?.wedding !== undefined);

  if (weddingDays.length === 0) return 50;

  const totalScore = weddingDays.reduce((sum, day) => sum + (day.scores?.wedding || 0), 0);
  return Math.round(totalScore / weddingDays.length);
}

// Helper to estimate price level based on country/region (1=budget, 2=moderate, 3=expensive)
function getPriceLevel(country: string, slug: string): number {
  // Expensive destinations
  const expensive = ['switzerland', 'norway', 'iceland', 'monaco', 'maldives', 'bora-bora', 'french polynesia', 'dubai', 'uae', 'qatar', 'singapore', 'japan', 'australia', 'new zealand', 'united kingdom', 'united states', 'bermuda'];

  // Budget destinations
  const budget = ['thailand', 'vietnam', 'indonesia', 'bali', 'philippines', 'india', 'mexico', 'colombia', 'peru', 'brazil', 'egypt', 'morocco', 'turkey', 'portugal', 'spain', 'greece', 'croatia', 'bulgaria', 'poland', 'czech republic', 'hungary', 'romania', 'dom. republic', 'dominican republic'];

  const countryLower = country.toLowerCase();
  const slugLower = slug.toLowerCase();

  if (expensive.some(e => countryLower.includes(e) || slugLower.includes(e))) return 3;
  if (budget.some(b => countryLower.includes(b) || slugLower.includes(b))) return 1;
  return 2; // Moderate
}

// Category definitions with map regions
const CATEGORY_DEFINITIONS = [
  {
    title: "Europe",
    description: "Historic capitals and romantic getaways",
    mapRegion: "europe",
    slugs: ['prague', 'berlin', 'london', 'paris', 'rome', 'barcelona', 'vienna', 'zurich', 'athens', 'amsterdam', 'madrid', 'brussels', 'warsaw', 'budapest', 'lisbon', 'dublin', 'stockholm', 'copenhagen', 'oslo', 'helsinki', 'bratislava', 'istanbul', 'edinburgh', 'munich', 'venice', 'krakow', 'porto', 'lyon', 'hamburg', 'seville', 'naples', 'valletta', 'rhodes', 'sofia', 'riga']
  },
  {
    title: "Asia & Pacific",
    description: "Exotic destinations and futuristic cities",
    mapRegion: "asia",
    slugs: ['tokyo', 'kyoto', 'osaka', 'seoul', 'beijing', 'shanghai', 'hong-kong', 'taipei', 'bangkok', 'phuket', 'chiang-mai', 'singapore', 'kuala-lumpur', 'hanoi', 'ho-chi-minh', 'jakarta', 'bali', 'manila', 'mumbai', 'new-delhi', 'sapporo', 'busan', 'chengdu', 'kathmandu', 'colombo', 'almaty', 'tashkent', 'fukuoka']
  },
  {
    title: "Middle East",
    description: "Ancient heritage meets luxury",
    mapRegion: "middle-east",
    slugs: ['dubai', 'abu-dhabi', 'doha', 'tel-aviv', 'muscat']
  },
  {
    title: "North America",
    description: "Vibrant cities coast to coast",
    mapRegion: "north-america",
    slugs: ['new-york', 'los-angeles', 'san-francisco', 'miami', 'vancouver', 'toronto', 'mexico-city', 'chicago', 'boston', 'las-vegas', 'honolulu', 'montreal', 'calgary', 'new-orleans']
  },
  {
    title: "South America",
    description: "Passionate cultures and landscapes",
    mapRegion: "south-america",
    slugs: ['rio-de-janeiro', 'buenos-aires', 'lima', 'santiago', 'bogota', 'sao-paulo', 'quito', 'cusco', 'san-jose-cr']
  },
  {
    title: "Oceania",
    description: "Adventures down under",
    mapRegion: "oceania",
    slugs: ['sydney', 'melbourne', 'auckland', 'brisbane', 'perth', 'christchurch', 'nadi', 'papeete']
  },
  {
    title: "Africa",
    description: "Diverse beauty from Med to Cape",
    mapRegion: "africa",
    slugs: ['cape-town', 'marrakech', 'zanzibar', 'cairo', 'johannesburg', 'nairobi', 'casablanca']
  },
  {
    title: "Caribbean & Tropical",
    description: "Beach resorts and paradise islands",
    mapRegion: "caribbean",
    slugs: ['cancun', 'punta-cana', 'nassau', 'san-juan', 'montego-bay', 'bora-bora', 'male', 'cartagena']
  },
  {
    title: "Mediterranean Escapes",
    description: "Sun-soaked coastlines",
    mapRegion: "mediterranean",
    slugs: ['palma-mallorca', 'nice', 'dubrovnik', 'santorini', 'las-palmas']
  },
  {
    title: "Mountain & Adventure",
    description: "Alpine peaks and outdoor thrills",
    mapRegion: "mountain",
    slugs: ['reykjavik', 'queenstown', 'innsbruck', 'interlaken', 'whistler']
  }
];

export default async function Home() {
  const citySlugs = await getAllCities();

  // Fetch details for all cities with enhanced data for unique tips
  // First create a slug-to-region mapping
  const slugToRegion = new Map<string, string>();
  CATEGORY_DEFINITIONS.forEach(cat => {
    cat.slugs.forEach(slug => { slugToRegion.set(slug, cat.mapRegion); });
  });

  const citiesData = await Promise.all(
    citySlugs.map(async (slug) => {
      const data = await getCityData(slug);
      return {
        slug,
        name: data?.meta.name || slug,
        country: data?.meta.country || "",
        desc: data?.meta.desc || "",
        bestMonths: data?.yearly_stats ? getBestMonths(data.yearly_stats) : undefined,
        avgTemp: data?.yearly_stats ? getAverageTemp(data.yearly_stats) : undefined,
        avgRainfall: data?.days ? getAnnualRainfall(data.days) : undefined,
        avgRainProb: data?.days ? getAverageRainRisk(data.days) : undefined,
        avgWaveHeight: data?.days ? getAverageWaveHeight(data.days) : undefined,
        avgWaterTemp: data?.days ? getAverageWaterTemp(data.days) : undefined,
        avgWeddingScore: data?.days ? getAverageWeddingScore(data.days) : 50,
        priceLevel: getPriceLevel(data?.meta.country || "", slug),
        isCoastal: data?.meta.is_coastal || false,
        region: slugToRegion.get(slug) || 'europe',
      };
    })
  );

  // Create cities lookup by slug
  const citiesMap = new Map(citiesData.map(c => [c.slug, c]));

  // Build categories with actual city data
  const categories = CATEGORY_DEFINITIONS
    .map(cat => {
      const categoryCities = cat.slugs
        .filter(slug => citiesMap.has(slug))
        .map(slug => citiesMap.get(slug)!)
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        title: cat.title,
        description: cat.description,
        mapRegion: cat.mapRegion,
        cities: categoryCities
      };
    })
    .filter(cat => cat.cities.length > 0);

  // Simple cities for search
  const searchCities = citiesData.map(c => ({
    slug: c.slug,
    name: c.name,
    country: c.country
  }));

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How far ahead can you forecast weather?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide long-range weather forecasts for any date up to 365 days ahead. Our predictions are based on 30 years of NASA POWER satellite data.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate is a long-range weather forecast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our forecasts are based on historical probability from 30 years of data, showing actual probability of rain, temperature ranges, and weather patterns for your specific date.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I get a weather forecast for my wedding date?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our wedding weather forecast tool shows exact probability of rain, average temperatures, and crowd levels for any date, helping you plan outdoor weddings 6-12 months ahead.'
        }
      },
      {
        '@type': 'Question',
        name: 'What cities have long-range weather forecasts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We provide 365-day weather forecasts for ${citySlugs.length}+ cities worldwide with detailed 30-year historical analysis covering all 366 days of the year.`
        }
      },
      {
        '@type': 'Question',
        name: 'Is the long-range weather forecast free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our long-range weather forecasts are completely free. We believe everyone should have access to reliable weather data for planning important events.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Navbar (Minimalist with Logo) */}
      <header className="absolute top-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <nav className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-lg bg-white flex items-center justify-center p-0.5">
            <img src="/logo.svg" alt="30YearWeather - Historical Weather Forecast Logo" width="28" height="28" className="w-full h-full object-contain" />
          </div>
          <div className="text-xl font-bold tracking-tight text-white drop-shadow-md">30YearWeather.</div>
        </nav>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
          <a href="#cities" className="hover:text-white hover:underline transition-all">Destinations</a>
          <a href="/methodology" className="hover:text-white hover:underline transition-all">Methodology</a>
          <a href="/about" className="hover:text-white hover:underline transition-all">About</a>
          <UnitToggle />
        </nav>
      </header>

      {/* 2. Hero Section (Compact without search) */}
      <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center border-b border-stone-200">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero1-optimized.webp"
            alt="Historical weather forecast and climate data analysis for travel planning"
            fill
            className="object-cover"
            priority
            quality={75}
          />
          {/* Gradient Overlay - Enhanced for better text readability */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center text-center pt-24 pb-16">
          <div className="animate-fade-in-up">
            {/* Compact badge */}
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
              {citySlugs.length}+ Destinations • 365 Days • 30 Years of Data
            </span>

            {/* Headline - Cleaner and more impactful */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
              Plan Your Perfect Trip<br />
              <span className="italic text-orange-200">with Historical Weather</span>
            </h1>

            {/* Subtitle - Shorter, value-focused */}
            <p className="text-base md:text-lg text-stone-200 mb-8 max-w-xl mx-auto leading-relaxed drop-shadow-md font-medium">
              Know exactly what weather to expect on any date. NASA satellite data spanning 30 years.
            </p>

            {/* Quick stats badges */}
            <div className="flex items-center justify-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Globe className="w-4 h-4" />
                <span className="font-semibold">{citySlugs.length}+</span> cities
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sun className="w-4 h-4" />
                <span className="font-semibold">365</span> days
              </span>
              <span className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Umbrella className="w-4 h-4" />
                <span className="font-semibold">30</span> years data
              </span>
            </div>

            {/* Scroll down indicator */}
            <a href="#cities" className="mt-10 inline-flex flex-col items-center text-white/70 hover:text-white transition-colors group">
              <span className="text-sm font-medium mb-2">Explore destinations</span>
              <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2 group-hover:border-white/50">
                <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce group-hover:bg-white" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* 3. Smart City Explorer with Intelligent Filtering - NOW FIRST */}
        <section id="cities" className="bg-stone-50 py-16 border-t border-stone-100">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-2">Explore Destinations</h2>
              <p className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-3">Find Your Perfect Weather</p>
              <p className="text-stone-500 max-w-2xl mx-auto">Search for a city or filter by region, month, temperature, and more to discover ideal destinations.</p>
            </div>

            {/* Smart City Explorer with Filter + Grid */}
            <SmartCityExplorer allCities={citiesData} />
          </div>
        </section>

        {/* 4. Perfect For... (Use Cases) - NOW SECOND */}
        <section id="use-cases" className="py-16 px-6 md:px-12 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-orange-700 font-bold text-xs uppercase tracking-widest">Plan With Confidence</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mt-2 mb-3">Weather Intelligence for Every Occasion</h2>
              <p className="text-stone-600 max-w-xl mx-auto text-sm">Make data-driven decisions for weddings, travel, photography, and events.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Wedding Planning */}
              <div className="group bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Wedding Planning</h3>
                <p className="text-stone-500 text-xs">Find the driest weekends</p>
              </div>

              {/* Travel */}
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Travel & Vacations</h3>
                <p className="text-stone-500 text-xs">Avoid monsoon seasons</p>
              </div>

              {/* Photography */}
              <div className="group bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Photography</h3>
                <p className="text-stone-500 text-xs">Best golden hour days</p>
              </div>

              {/* Outdoor Events */}
              <div className="group bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Tent className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Outdoor Events</h3>
                <p className="text-stone-500 text-xs">Plan festivals & concerts</p>
              </div>

              {/* Study Abroad */}
              <div className="group bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Study Abroad</h3>
                <p className="text-stone-500 text-xs">Year-round insights</p>
              </div>

              {/* Seasonal */}
              <div className="group bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                <div className="w-12 h-12 bg-stone-200 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-stone-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Seasonal Planning</h3>
                <p className="text-stone-500 text-xs">Cherry blossoms & more</p>
              </div>
            </div>

            {/* Data Sources Badge */}
            <div className="mt-10 text-center">
              <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold mb-3">Powered by trusted data</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["NASA POWER", "Open-Meteo", "ERA5", "30 Years"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-stone-100 rounded-full text-xs font-medium text-stone-600 border border-stone-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - More Compact */}
        <section className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="group border-b border-stone-200 pb-4">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center hover:text-orange-600 transition-colors">
                How far ahead can you forecast weather?
                <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">
                We provide long-range weather forecasts for any date up to 365 days ahead. Our predictions are based on 30 years of NASA POWER satellite data, showing you what the weather was actually like on your chosen date over the past three decades.
              </p>
            </details>

            <details className="group border-b border-stone-200 pb-4">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center hover:text-orange-600 transition-colors">
                How accurate is a long-range weather forecast?
                <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">
                Our forecasts show historical probability, not speculation. While traditional 7-day forecasts are only 80% accurate, our 30-year data shows actual probability of rain, temperature ranges, and patterns for your date.
              </p>
            </details>

            <details className="group border-b border-stone-200 pb-4">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center hover:text-orange-600 transition-colors">
                Can I get a weather forecast for my wedding?
                <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">
                Yes! Our wedding weather tool shows exact rain probability, average temperatures, and crowd levels for any date. Plan your outdoor wedding with confidence, even 6-12 months ahead.
              </p>
            </details>

            <details className="group border-b border-stone-200 pb-4">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center hover:text-orange-600 transition-colors">
                What cities are available?
                <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">
                We provide 365-day forecasts for <strong>{citySlugs.length}+ cities worldwide</strong> including Prague, Paris, Rome, Barcelona, London, Tokyo, Bali, Dubai, New York, Sydney, and many more.
              </p>
            </details>

            <details className="group pb-4">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center hover:text-orange-600 transition-colors">
                Is this free?
                <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">
                Yes! Our long-range weather forecasts are completely free for personal use. We believe everyone should have access to reliable weather data for planning important events.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
