'use client';

import { useEffect } from 'react';
import { trackCityView } from '@/lib/analytics';

interface CityPageTrackerProps {
  cityName: string;
  citySlug: string;
}

export default function CityPageTracker({ cityName, citySlug }: CityPageTrackerProps) {
  useEffect(() => {
    // Track city view when component mounts
    trackCityView(cityName, citySlug);
  }, [cityName, citySlug]);

  return null;
}

