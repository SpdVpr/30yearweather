// Google Analytics 4 tracking functions

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for your app

// Track city view
export const trackCityView = (cityName: string, citySlug: string) => {
  event({
    action: 'view_city',
    category: 'engagement',
    label: `${cityName} (${citySlug})`,
  });
};

// Track date view
export const trackDateView = (cityName: string, date: string) => {
  event({
    action: 'view_date',
    category: 'engagement',
    label: `${cityName} - ${date}`,
  });
};

// Track weather verdict interaction
export const trackVerdictView = (verdict: string, cityName: string, date: string) => {
  event({
    action: 'view_verdict',
    category: 'weather_decision',
    label: `${verdict} - ${cityName} - ${date}`,
  });
};

// Track calendar interaction
export const trackCalendarClick = (cityName: string, month: string) => {
  event({
    action: 'click_calendar',
    category: 'interaction',
    label: `${cityName} - ${month}`,
  });
};

// Track tourism data view
export const trackTourismView = (cityName: string) => {
  event({
    action: 'view_tourism',
    category: 'engagement',
    label: cityName,
  });
};

// Track search/filter usage
export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, label: string) => {
  event({
    action: 'click_external_link',
    category: 'outbound',
    label: `${label} - ${url}`,
  });
};

// Track share actions
export const trackShare = (platform: string, cityName: string, date?: string) => {
  event({
    action: 'share',
    category: 'social',
    label: `${platform} - ${cityName}${date ? ` - ${date}` : ''}`,
  });
};

// Track weather card interactions
export const trackWeatherCardExpand = (cardType: string, cityName: string) => {
  event({
    action: 'expand_card',
    category: 'interaction',
    label: `${cardType} - ${cityName}`,
  });
};

// Track time spent on page (call this on unmount)
export const trackTimeOnPage = (cityName: string, seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    label: cityName,
    value: seconds,
  });
};

