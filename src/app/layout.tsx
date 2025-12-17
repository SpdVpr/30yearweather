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
    description: 'Long-range weather forecasts based on 30 years of NASA satellite data',
    foundingDate: '2024',
    creator: {
      '@type': 'Organization',
      name: '30YearWeather',
      url: baseUrl.toString()
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@30yearweather.com',
      availableLanguage: ['English', 'Czech']
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Prague',
      addressCountry: 'CZ'
    },
    sameAs: []
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
    keywords: 'weather forecast, long range weather, historical weather data, wedding planning, travel planning',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  };

  // WebSite Schema with SearchAction for Google Sitelinks Search Box
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '30YearWeather',
    url: baseUrl.toString(),
    description: '365-day weather forecasts based on 30 years of historical data',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl.toString()}?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ea580c" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema, creativeWorkSchema]) }}
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
