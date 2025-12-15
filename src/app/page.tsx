import Link from "next/link";
import Image from "next/image";
import { getAllCities, getCityData } from "@/lib/data";
import {
  Sun,
  Map as MapIcon,
  ArrowRight,
  TrendingUp,
  CloudRain,
  Calendar
} from "lucide-react";

export const metadata = {
  title: "Long-Range Weather Forecast | 365-Day Predictions Based on 30 Years of Data",
  description: "Get accurate long-range weather forecasts for any date up to 365 days ahead. Based on 30 years of NASA satellite data. Perfect for wedding planning, travel, and events.",
  keywords: ["long range weather forecast", "365 day weather forecast", "year ahead weather forecast", "weather forecast", "long term weather forecast", "extended weather forecast", "wedding weather forecast", "travel weather forecast", "historical weather forecast", "30 year weather data"],
};

export default async function Home() {
  const citySlugs = await getAllCities();

  // Fetch details for all cities
  const cities = await Promise.all(
    citySlugs.map(async (slug) => {
      const data = await getCityData(slug);
      return {
        slug,
        name: data?.meta.name || slug,
        country: data?.meta.country || "",
        desc: data?.meta.desc || "Historical weather data analysis.",
      };
    })
  );

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
          text: 'We provide long-range weather forecasts for any date up to 365 days ahead. Unlike traditional 7-day forecasts, our predictions are based on 30 years of NASA POWER satellite data, showing you what the weather was actually like on your chosen date over the past three decades.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate is a long-range weather forecast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our long-range forecasts are based on historical probability, not speculation. While traditional 7-day forecasts are only 80% accurate and anything beyond 10 days is unreliable, our 30-year historical data shows you the actual probability of rain, temperature ranges, and weather patterns for your specific date. This makes it significantly more reliable for long-term planning.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I get a weather forecast for my wedding date?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! Our wedding weather forecast tool is perfect for planning outdoor weddings. You can see the exact probability of rain, average temperatures, and crowd levels for any date in your chosen city. This helps you pick the perfect outdoor wedding date with confidence, even if your wedding is 6-12 months away.'
        }
      },
      {
        '@type': 'Question',
        name: 'What cities have long-range weather forecasts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We currently provide 365-day weather forecasts for Prague and Berlin with detailed 30-year analysis. We are rapidly expanding to cover 100+ major cities worldwide in 2025, including Paris, Rome, Barcelona, London, and New York.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the long-range weather forecast free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our long-range weather forecasts are completely free for personal use. We believe everyone should have access to reliable weather predictions for planning their weddings, vacations, and important life events.'
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
      <nav className="absolute top-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-lg bg-white flex items-center justify-center">
            <img src="/favicon_io/android-chrome-192x192.png" alt="30YearWeather Logo" className="w-full h-full object-cover" />
          </div>
          <div className="text-xl font-bold tracking-tight text-white drop-shadow-md">30YearWeather.</div>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-white/90">
          <a href="#cities" className="hover:text-white hover:underline transition-all">Destinations</a>
          <a href="#methodology" className="hover:text-white hover:underline transition-all">Methodology</a>
          <a href="#" className="hover:text-white hover:underline transition-all opacity-80">About</a>
        </div>
      </nav>

      {/* 2. Hero Section (Immersive) */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-travel.webp"
            alt="Couple planning trip in sunny city"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 w-full px-6 md:px-12 pb-24 md:pb-32 max-w-7xl mx-auto">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium uppercase tracking-widest">
              365-Day Weather Forecast
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Long-Range Weather<br /><span className="italic text-orange-200">Forecast</span> You Can Trust
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-8 max-w-lg leading-relaxed">
              Get weather forecasts for any date up to 365 days ahead. Based on 30 years of NASA satellite data, not guesswork. Perfect for weddings, travel, and events.
            </p>
            <div className="flex gap-4">
              <Link href="#cities" className="bg-white text-stone-900 px-8 py-4 rounded-full font-semibold hover:bg-stone-100 transition-all flex items-center gap-2">
                Get Your Forecast <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Features (Bento Grid) */}
      <section id="methodology" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Science, not speculation.</h2>
            <p className="text-stone-600">Standard forecasts change hourly. Our historical probability models give you the long-term truth about any destination.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: Temperature */}
          <div className="bg-stone-100 rounded-3xl p-8 flex flex-col justify-between hover:bg-stone-200 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sun className="w-32 h-32" />
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600 mb-4" />
            <div>
              <h3 className="text-xl font-bold mb-2">Real Feel Temps</h3>
              <p className="text-stone-600 text-sm">We don't just show averages. We show the probability of it being "too hot" or "too cold" for your comfort.</p>
            </div>
          </div>

          {/* Card 2: Rain (Wide) */}
          <div className="md:col-span-2 bg-stone-900 text-white rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <CloudRain className="w-10 h-10 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Will it rain on your wedding?</h3>
                <p className="text-stone-400">Our precipitation model calculates the exact % chance of rain for every specific day of the year, based on 10,950 days of history.</p>
              </div>
              {/* Decorative Chart Placeholder */}
              <div className="h-32 w-full md:w-1/2 flex items-end gap-1 opacity-50">
                {[40, 60, 30, 80, 50, 20, 90, 40, 60, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Crowds */}
          <div className="md:col-span-1 bg-orange-100 text-orange-900 rounded-3xl p-8 flex flex-col justify-between hover:bg-orange-200 transition-colors">
            <Calendar className="w-8 h-8 text-orange-600 mb-4" />
            <div>
              <h3 className="text-xl font-bold mb-2">Crowd Intelligence</h3>
              <p className="text-orange-800/80 text-sm">New! We now track tourist density and seasonal pricing to find the hidden quiet weeks.</p>
            </div>
          </div>

          {/* Card 4: Data Sources */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Trusted Data Sources</h3>
              <div className="flex flex-wrap gap-3 mt-4">
                {["NASA POWER", "OpenStreetMap", "World Bank", "Sentinel-2", "ERA5"].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600 border border-stone-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 text-xs text-stone-400 uppercase tracking-widest font-semibold">
              Updated for 2025 Season
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cities List (Editorial Style) */}
      <section id="cities" className="bg-white py-24 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-12">Curated Destinations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {cities.map((city) => {
              // Simple image mapping for MVP
              const cityImage =
                city.slug === 'prague-cz' ? '/images/prague-hero.webp' :
                  city.slug === 'berlin-de' ? '/images/berlin-de-hero.webp' :
                    city.slug === 'tokyo-jp' ? '/images/tokyo-hero.png' :
                      null;

              return (
                <Link key={city.slug} href={`/${city.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-100 mb-6 shadow-sm transition-shadow group-hover:shadow-md">
                    {cityImage ? (
                      <Image
                        src={cityImage}
                        alt={city.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-stone-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <MapIcon className="w-16 h-16 text-stone-300 stroke-1" />
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-900 border border-white/50">
                      {city.country}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="max-w-md">
                      <h3 className="text-3xl font-serif font-bold text-stone-900 group-hover:text-orange-600 transition-colors mb-2">
                        {city.name}
                      </h3>
                      <p className="text-stone-500 line-clamp-2 leading-relaxed">
                        {city.desc}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* "Suggest a City" Block */}
            <div className="flex flex-col justify-center items-center text-center p-12 border border-dashed border-stone-300 rounded-sm hover:bg-stone-50 transition-colors">
              <h3 className="text-xl font-bold font-serif mb-2">Missing your city?</h3>
              <p className="text-stone-500 mb-6 max-w-xs">We process new locations weekly. Request a destination for deep analysis.</p>
              <button className="text-sm font-bold border-b-2 border-orange-500 pb-0.5 hover:text-orange-600 transition-colors">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-xl font-bold mb-3">How far ahead can you forecast weather?</h3>
            <p className="text-stone-600 leading-relaxed">
              We provide long-range weather forecasts for any date up to 365 days ahead. Unlike traditional 7-day forecasts,
              our predictions are based on 30 years of NASA POWER satellite data, showing you what the weather was actually
              like on your chosen date over the past three decades.
            </p>
          </div>

          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-xl font-bold mb-3">How accurate is a long-range weather forecast?</h3>
            <p className="text-stone-600 leading-relaxed">
              Our long-range forecasts are based on historical probability, not speculation. While traditional 7-day forecasts
              are only 80% accurate and anything beyond 10 days is unreliable, our 30-year historical data shows you the actual
              probability of rain, temperature ranges, and weather patterns for your specific date. This makes it significantly
              more reliable for long-term planning.
            </p>
          </div>

          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-xl font-bold mb-3">Can I get a weather forecast for my wedding date?</h3>
            <p className="text-stone-600 leading-relaxed">
              Absolutely! Our wedding weather forecast tool is perfect for planning outdoor weddings. You can see the exact
              probability of rain, average temperatures, and crowd levels for any date in your chosen city. This helps you
              pick the perfect outdoor wedding date with confidence, even if your wedding is 6-12 months away.
            </p>
          </div>

          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-xl font-bold mb-3">What cities have long-range weather forecasts?</h3>
            <p className="text-stone-600 leading-relaxed">
              We currently provide 365-day weather forecasts for Prague and Berlin with detailed 30-year analysis. We are
              rapidly expanding to cover 100+ major cities worldwide in 2025, including Paris, Rome, Barcelona, London, and New York.
            </p>
          </div>

          <div className="pb-6">
            <h3 className="text-xl font-bold mb-3">Is the long-range weather forecast free?</h3>
            <p className="text-stone-600 leading-relaxed">
              Yes! Our long-range weather forecasts are completely free for personal use. We believe everyone should have
              access to reliable weather predictions for planning their weddings, vacations, and important life events.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h4 className="text-white text-2xl font-serif font-bold mb-6">30YearWeather.</h4>
            <p className="max-w-xs leading-relaxed">
              Making meteorology accessible for long-term planning. Because averages lie, but data doesn't.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <span className="text-white font-bold mb-2">Product</span>
              <a href="#" className="hover:text-white">Destinations</a>
              <a href="#" className="hover:text-white">Methodology</a>
              <a href="#" className="hover:text-white">API Access</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white font-bold mb-2">Company</span>
              <a href="#" className="hover:text-white">About Us</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Privacy</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-stone-800 text-xs flex justify-between">
          <span>© 2024 30YearWeather Intelligence.</span>
          <span>Prague, Czech Republic</span>
        </div>
      </footer>
    </div>
  );
}
