import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsTracker from "@/components/AnalyticsTracker";

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
  },
  twitter: {
    card: 'summary_large_image',
  },
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
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global Organization Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '30YearWeather',
    url: baseUrl.toString(),
    logo: `${baseUrl.toString()}icon.png`,
    sameAs: []
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-slate-50 text-slate-900`}
      >
        <GoogleAnalytics />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
