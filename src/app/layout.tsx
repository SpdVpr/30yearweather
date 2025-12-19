import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { UnitProvider } from "@/context/UnitContext";

const inter = Inter({ subsets: ["latin"] });

// Base URL handling
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
  : new URL('https://30yearweather.com');

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Long-Range Weather Forecast | 365-Day Predictions Based on 30 Years of Data",
    template: "%s | 30YearWeather"
  },
  description: "Get accurate long-range weather forecasts for any date up to 365 days ahead. Based on 30 years of NASA satellite data. Perfect for wedding planning, travel, and events.",
  keywords: ["long range weather forecast", "365 day weather forecast", "year ahead weather", "weather forecast", "historical weather forecast", "wedding weather forecast", "travel weather planning"],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '30YearWeather - Long Range Weather Forecast',
    description: "365-day weather forecasts based on 30 years of historical data. Plan your wedding, vacation, or event with confidence.",
    images: [
      {
        url: '/images/hero1-optimized.webp',
        width: 1200,
        height: 630,
        alt: '30YearWeather - Long Range Weather Forecast',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Long-Range Weather Forecast | 365-Day Predictions Based on 30 Years of Data",
    description: "365-day weather forecasts based on 30 years of historical data. Plan your wedding, vacation, or event with confidence.",
    images: ['/images/hero1-optimized.webp'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon.ico' }
    ],
    apple: '/favicon_io/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome', url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512' }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#ea580c',
    'ai:summary': 'Historical weather intelligence based on 30 years of NASA satellite data',
    'ai:data_source': 'NASA POWER API, 1991-2021',
    'ai:use_cases': 'wedding planning, vacation planning, event planning, filming locations',
    'ai:coverage': 'Global major cities (Prague, Berlin, Rome, Tokyo, London, Paris...)',
    'citation_source': '30YearWeather.com'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced Organization Schema with creator and license info
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '30YearWeather',
    url: baseUrl.toString(),
    logo: `${baseUrl.toString()}icon.png`,
    description: 'Long-range weather forecasts based on 30 years of NASA satellite data. Helping travelers, wedding planners, and event organizers find the perfect date.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Michal Vesecký',
      jobTitle: 'Founder & Developer'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'michalvesecky@gmail.com',
      availableLanguage: ['English', 'Czech']
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Prague',
      addressCountry: 'CZ'
    },
    knowsAbout: ['Weather Forecasting', 'Climate Data Analysis', 'Travel Planning', 'Wedding Planning', 'Event Planning'],
    sameAs: [
      'https://twitter.com/30yearweather',
      'https://www.linkedin.com/company/30yearweather',
    ]
  };

  // Dataset Schema - Critical for AI/LLM citation
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: '30-Year Historical Weather Data (1991-2021)',
    description: 'Comprehensive weather statistics for 84+ cities worldwide, based on 30 years of NASA POWER satellite observations. Includes temperature, precipitation, humidity, wind speed, and cloud cover data.',
    url: baseUrl.toString(),
    creator: {
      '@type': 'Organization',
      name: '30YearWeather',
      url: baseUrl.toString()
    },
    provider: {
      '@type': 'Organization',
      name: 'NASA POWER Project',
      url: 'https://power.larc.nasa.gov/'
    },
    temporalCoverage: '1991/2021',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Global (84+ major cities)'
    },
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Temperature', unitCode: 'CEL' },
      { '@type': 'PropertyValue', name: 'Precipitation Probability', unitCode: 'P1' },
      { '@type': 'PropertyValue', name: 'Wind Speed', unitCode: 'KMH' },
      { '@type': 'PropertyValue', name: 'Humidity', unitCode: 'P1' },
      { '@type': 'PropertyValue', name: 'Cloud Cover', unitCode: 'P1' }
    ],
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${baseUrl.toString()}api/weather/`
    },
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    isAccessibleForFree: true,
    keywords: ['weather data', 'climate data', 'NASA POWER', 'historical weather', '30 year average']
  };

  // HowTo Schema - Wedding Planning Guide
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Pick the Perfect Wedding Date Using Historical Weather Data',
    description: 'Step-by-step guide to choosing your outdoor wedding date based on 30 years of historical weather patterns for minimal rain risk and optimal temperatures.',
    totalTime: 'PT15M',
    tool: [
      { '@type': 'HowToTool', name: '30YearWeather City Forecast' }
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose Your Destination',
        text: 'Select your wedding city from our 84+ destinations. Each city has detailed weather data for all 366 days.',
        url: `${baseUrl.toString()}#cities`
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Identify Your Preferred Months',
        text: 'Look at the monthly overview to find months with temperatures between 18-26°C and rain probability under 25%.'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Compare Specific Dates',
        text: 'Drill down to daily forecasts to compare rain probabilities, temperatures, and our Wedding Score for each date.'
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Check Alternative Dates',
        text: 'Review nearby dates (±7 days) to find the lowest risk option. Our tool shows improvement percentages.'
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Plan Your Backup',
        text: 'Even with low rain probability, always have an indoor backup plan. Weather is never 100% predictable.'
      }
    ]
  };

  // WebSite Schema with SearchAction for Google Sitelinks Search Box
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '30YearWeather',
    url: baseUrl.toString(),
    description: '365-day weather forecasts based on 30 years of historical NASA satellite data. Perfect for wedding planning, travel, and events.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl.toString()}?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // CreativeWork Schema with license information
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: '30YearWeather Historical Weather Forecasts',
    description: 'Long-range weather forecasts based on 30 years of historical NASA satellite data',
    url: baseUrl.toString(),
    creator: {
      '@type': 'Organization',
      name: '30YearWeather',
      url: baseUrl.toString()
    },
    publisher: {
      '@type': 'Organization',
      name: '30YearWeather',
      url: baseUrl.toString(),
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl.toString()}icon.png`
      }
    },
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    copyrightHolder: {
      '@type': 'Organization',
      name: '30YearWeather'
    },
    copyrightYear: '2025',
    inLanguage: 'en-US',
    keywords: 'weather forecast, long range weather, historical weather data, wedding planning, travel planning, event planning, NASA POWER data',
    datePublished: '2024-12-01',
    dateModified: new Date().toISOString().split('T')[0]
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ea580c" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema, creativeWorkSchema, datasetSchema, howToSchema]) }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-slate-50 text-slate-900`}
      >
        <GoogleAnalytics />
        <AnalyticsTracker />
        <UnitProvider>
          {children}
        </UnitProvider>
      </body>
    </html>
  );
}
