'use client';

import { useEffect } from 'react';
import { trackDateView, trackVerdictView } from '@/lib/analytics';

interface DatePageTrackerProps {
  cityName: string;
  date: string;
  verdict?: string;
}

export default function DatePageTracker({ cityName, date, verdict }: DatePageTrackerProps) {
  useEffect(() => {
    // Track date view when component mounts
    trackDateView(cityName, date);
    
    // Track verdict if available
    if (verdict) {
      trackVerdictView(verdict, cityName, date);
    }
  }, [cityName, date, verdict]);

  return null;
}

