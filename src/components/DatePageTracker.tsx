'use client';

import { useEffect } from 'react';
import { event } from '@/lib/analytics';

interface DatePageTrackerProps {
  cityName: string;
  date: string;
  verdict?: string;
}

export default function DatePageTracker({ cityName, date, verdict }: DatePageTrackerProps) {
  useEffect(() => {
    // Track date view when component mounts
    event({
      action: 'view_date',
      category: 'Engagement',
      label: `${cityName} - ${date}`,
      value: 1
    });

    // Track verdict if available
    if (verdict) {
      event({
        action: 'view_verdict',
        category: 'Insight',
        label: verdict
      });
    }
  }, [cityName, date, verdict]);

  return null;
}
