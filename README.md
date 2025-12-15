# 🌦️ 30YearWeather

**Don't guess the weather. Know it.**

A Next.js application that provides historical weather insights based on 30 years of data to help users plan trips, weddings, and events with confidence.

## ✨ Features

- 📊 **30-Year Historical Data** - Weather patterns from 3 decades of satellite data
- 🎯 **Travel Comfort Index** - AI-calculated metrics for crowds, prices, and weather quality
- 🌍 **Multiple Cities** - Growing database of travel destinations
- 📱 **Responsive Design** - Beautiful mobile and desktop experience
- ⚡ **Fast Performance** - Optimized with Next.js 14 App Router, WebP images
- 🔍 **SEO Optimized** - Full metadata, JSON-LD structured data

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Tremor, Lucide Icons
- **Charts**: Recharts
- **Animations**: Framer Motion

### Data & Infrastructure
- **Database**: Firebase Firestore
- **Storage**: Vercel Edge Network
- **Data Sources**: NASA POWER, OpenStreetMap, World Bank API

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/30yearweather.git
cd 30yearweather

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Environment Variables

Create `frontend/.env.local` with your Firebase configuration:

```bash
# Copy from frontend/.env.example and fill in your Firebase credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

NEXT_PUBLIC_BASE_URL=https://30yearweather.com
```

> **Note**: This repository contains only the frontend. The backend ETL pipeline (Python scripts) runs locally to generate and upload data to Firebase Firestore.

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities & data fetching
│   └── data/            # Static JSON data
├── public/
│   ├── images/          # Hero images (WebP)
│   └── data/            # City weather JSON
└── scripts/             # Build utilities
```

## 🏗️ Data Architecture

### Current Setup (MVP)
The frontend reads from **local JSON files** in `frontend/public/data/`:
- `prague-cz.json`
- `berlin-de.json`

### Backend (Local Only)
The Python ETL pipeline runs locally to:
1. Fetch 30 years of weather data from NASA POWER API
2. Calculate tourism metrics and scores
3. Upload data to **Firebase Firestore**
4. Generate JSON files for static deployment

### Adding a New City
1. Run backend ETL pipeline locally (Python scripts)
2. Data is uploaded to Firebase Firestore
3. Copy generated JSON to `frontend/public/data/`
4. Add city slug to `frontend/src/lib/data.ts` → `getAllCities()`
5. Add hero image to `frontend/public/images/`

## 🎨 Performance Optimizations

- ✅ WebP images (80%+ size reduction)
- ✅ Next.js Image optimization
- ✅ Static Site Generation (SSG)
- ✅ Code splitting
- ✅ Font optimization (next/font)
- ✅ Minimal JavaScript where possible

## 📊 Data Sources

- **Weather**: [Open-Meteo](https://open-meteo.com/) (ERA5, NASA POWER)
- **Tourism Attractions**: [OpenStreetMap](https://www.openstreetmap.org/)
- **Tourism Stats**: [World Bank Open Data](https://data.worldbank.org/)
- **Holidays**: [Nager.Date API](https://date.nager.at/)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Weather data powered by Open-Meteo & NASA
- Tourism data from OpenStreetMap contributors
- UI components by Tremor

---

**Made with ☀️ by the 30YearWeather team**
