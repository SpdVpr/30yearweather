import Link from "next/link";
import Image from "next/image";
import { getAllCities, getCityData } from "@/lib/data";
import {
  Heart,
  Plane,
  Camera,
  Calendar,
  Tent,
  GraduationCap
} from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";
import Footer from "@/components/Footer";
import UnitToggle from "@/components/UnitToggle";

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
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
          <a href="#cities" className="hover:text-white hover:underline transition-all">Destinations</a>
          <a href="#methodology" className="hover:text-white hover:underline transition-all">Methodology</a>
          <a href="#" className="hover:text-white hover:underline transition-all opacity-80">About</a>
          <UnitToggle />
        </div>
      </nav>
      {/* 2. Hero Section (Immersive) */}
      <div className="relative w-full min-h-[85vh] flex items-center justify-center border-b border-stone-200">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero1-optimized.webp"
            alt="Couple planning trip in sunny city"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient Overlay for Text Readability - Stronger for centered text */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center text-center pt-20 pb-20">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
              365-Day Weather Forecast
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-lg">
              Long-Range Weather<br /><span className="italic text-orange-200">Forecast</span> You Can Trust
            </h1>
            <p className="text-lg md:text-xl text-stone-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
              Get weather forecasts for any date up to 365 days ahead. Based on 30 years of NASA satellite data, not guesswork. Perfect for weddings, travel, and events.
            </p>

            {/* Smart Search */}
            <HeroSearch cities={cities} />
          </div>
        </div>
      </div>

      {/* 3. Perfect For... (Use Cases) */}
      <section id="use-cases" className="py-20 px-6 md:px-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">Who is this for?</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-3 mb-4">Perfect For...</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Whether you're planning the biggest day of your life or just a weekend getaway, we've got you covered.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Wedding Planning */}
            <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Wedding Planning</h3>
              <p className="text-stone-600 text-sm mb-4">Find the driest weekend in June. See the exact rain probability for your big day based on 30 years of data.</p>
              <div className="flex items-center text-rose-600 text-sm font-semibold">
                <span>Popular: June & September</span>
              </div>
            </div>

            {/* Travel Planning */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plane className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Travel & Vacations</h3>
              <p className="text-stone-600 text-sm mb-4">Avoid monsoon season and tourist crowds. Know exactly what weather to expect before you book flights.</p>
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <span>Save on off-peak travel</span>
              </div>
            </div>

            {/* Photography */}
            <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Photography Sessions</h3>
              <p className="text-stone-600 text-sm mb-4">Plan golden hour shoots with confidence. Check sunshine hours and cloud cover for perfect lighting conditions.</p>
              <div className="flex items-center text-amber-600 text-sm font-semibold">
                <span>Best light: Spring & Fall</span>
              </div>
            </div>

            {/* Outdoor Events */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Tent className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Outdoor Events</h3>
              <p className="text-stone-600 text-sm mb-4">Festivals, concerts, sports events. Pick the date with the lowest rain risk and most comfortable temperatures.</p>
              <div className="flex items-center text-emerald-600 text-sm font-semibold">
                <span>Plan months ahead</span>
              </div>
            </div>

            {/* Study Abroad */}
            <div className="group relative bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Study Abroad</h3>
              <p className="text-stone-600 text-sm mb-4">Moving to a new city for a semester? Know what clothes to pack and what weather to expect all year round.</p>
              <div className="flex items-center text-violet-600 text-sm font-semibold">
                <span>Year-round insights</span>
              </div>
            </div>

            {/* Seasonal Planning */}
            <div className="group relative bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-stone-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-stone-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Seasonal Planning</h3>
              <p className="text-stone-600 text-sm mb-4">When does cherry blossom season start? When's the first snow? Historical patterns reveal the answers.</p>
              <div className="flex items-center text-stone-600 text-sm font-semibold">
                <span>Nature's calendar decoded</span>
              </div>
            </div>
          </div>

          {/* Data Sources Badge */}
          <div className="mt-16 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-4">Powered by trusted data</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["NASA POWER", "Open-Meteo", "ERA5 Reanalysis", "30 Years of Data"].map(tag => (
                <span key={tag} className="px-4 py-2 bg-stone-100 rounded-full text-xs font-medium text-stone-600 border border-stone-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cities List (Editorial Style) */}
      <section id="cities" className="bg-white py-24 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-12">Curated Destinations</h2>

          {/* Categorized City Lists */}
          {[
            {
              title: "Europe",
              description: "Historic capitals and romantic getaways close to home.",
              slugs: ['prague', 'berlin', 'london', 'paris', 'rome', 'barcelona', 'vienna', 'zurich', 'athens', 'amsterdam', 'madrid', 'brussels', 'warsaw', 'budapest', 'lisbon', 'dublin', 'stockholm', 'copenhagen', 'oslo', 'helsinki', 'bratislava', 'istanbul', 'edinburgh', 'munich', 'venice', 'krakow', 'porto']
            },
            {
              title: "Asia & Pacific",
              description: "Exotic destinations and futuristic metropolises.",
              slugs: ['tokyo', 'kyoto', 'osaka', 'seoul', 'beijing', 'shanghai', 'hong-kong', 'taipei', 'bangkok', 'phuket', 'chiang-mai', 'singapore', 'kuala-lumpur', 'hanoi', 'ho-chi-minh', 'jakarta', 'bali', 'manila', 'mumbai', 'new-delhi', 'dubai']
            },
            {
              title: "North America",
              description: "Vibrant cities from coast to coast.",
              slugs: ['new-york', 'los-angeles', 'san-francisco', 'miami', 'vancouver', 'toronto', 'mexico-city']
            },
            {
              title: "South America",
              description: "Passionate cultures and breathtaking landscapes.",
              slugs: ['rio-de-janeiro', 'buenos-aires', 'lima', 'santiago']
            },
            {
              title: "Oceania",
              description: "Adventures down under and beyond.",
              slugs: ['sydney', 'melbourne', 'auckland']
            },
            {
              title: "Africa",
              description: "Diverse beauty from the Mediterranean to the Cape.",
              slugs: ['cape-town', 'marrakech', 'zanzibar']
            },
            {
              title: "Caribbean & Tropical Paradise",
              description: "All-inclusive resorts and pristine beaches.",
              slugs: ['cancun', 'punta-cana', 'nassau', 'san-juan', 'montego-bay', 'bora-bora', 'male', 'cartagena']
            },
            {
              title: "Mediterranean Escapes",
              description: "Sun-soaked coastlines and island getaways.",
              slugs: ['palma-mallorca', 'nice', 'dubrovnik', 'santorini', 'las-palmas']
            },
            {
              title: "Mountain & Adventure",
              description: "Alpine peaks, skiing, and outdoor thrills.",
              slugs: ['reykjavik', 'queenstown', 'innsbruck', 'interlaken', 'whistler']
            },
            {
              title: "Exotic & Luxury Retreats",
              description: "Ultimate honeymoon and premium getaways.",
              slugs: ['bora-bora', 'male', 'ras-al-khaimah', 'zanzibar']
            }
          ].map((category) => {
            // Filter cities for this category and sort alphabetically by name
            const categoryCities = cities
              .filter(c => category.slugs.includes(c.slug))
              .sort((a, b) => a.name.localeCompare(b.name));

            if (categoryCities.length === 0) return null;

            return (
              <div key={category.title} className="mb-20 last:mb-0">
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-bold text-stone-900">{category.title}</h3>
                  <p className="text-stone-500 mt-2">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {categoryCities.map((city) => {
                    // All hero images are now WebP (optimized)
                    const cityImage = `/images/${city.slug}-hero.webp`;

                    return (
                      <Link key={city.slug} href={`/${city.slug}`} className="group block">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 mb-4 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                          <Image
                            src={cityImage}
                            alt={city.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />

                          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-900 border border-white/50 rounded-sm">
                            {city.country}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors mb-1">
                            {city.name}
                          </h4>
                          <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                            {city.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}   {/* "Suggest a City" Block */}

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
      </section >

      {/* Footer */}
      <Footer />
    </div>
  );
}
