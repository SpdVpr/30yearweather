'use client';

import { useEffect } from 'react';
import { event } from '@/lib/analytics';

interface CityPageTrackerProps {
  cityName: string;
  citySlug: string;
}

export default function CityPageTracker({ cityName, citySlug }: CityPageTrackerProps) {
  useEffect(() => {
    // Track city view when component mounts
    event({
      action: 'view_city',
      category: 'Engagement',
      label: `${cityName} (${citySlug})`,
      value: 1
    });
  }, [cityName, citySlug]);

  return null;
}
