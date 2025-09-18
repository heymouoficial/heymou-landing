// Performance monitoring configuration

export const PERFORMANCE_CONFIG = {
  // Core Web Vitals thresholds
  thresholds: {
    LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
    FID: { good: 100, poor: 300 },   // First Input Delay (ms)
    CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
    TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
    INP: { good: 200, poor: 500 }    // Interaction to Next Paint (ms)
  },

  // Custom metrics thresholds
  customThresholds: {
    page_load_time: { good: 3000, poor: 5000 },
    dom_content_loaded: { good: 2000, poor: 4000 },
    component_mount_time: { good: 100, poor: 300 },
    api_call: { good: 1000, poor: 3000 },
    image_load_time: { good: 2000, poor: 4000 },
    resource_load_time: { good: 1500, poor: 3000 }
  },

  // Sampling rates (0-1)
  sampling: {
    webVitals: 1.0,        // Track all Web Vitals
    customMetrics: 0.1,    // Track 10% of custom metrics
    errors: 1.0,           // Track all errors
    userInteractions: 0.05  // Track 5% of user interactions
  },

  // Analytics endpoints
  endpoints: {
    webVitals: '/api/analytics/web-vitals',
    customMetrics: '/api/analytics/custom-metrics',
    errors: '/api/analytics/errors'
  },

  // Performance budgets (for monitoring)
  budgets: {
    // Bundle sizes (KB)
    javascript: 250,
    css: 50,
    images: 500,
    fonts: 100,
    
    // Network requests
    maxRequests: 50,
    
    // Performance scores (0-100)
    lighthouse: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 95
    }
  },

  // Critical resources to preload
  criticalResources: {
    fonts: [],
    images: [
      '/images/HeyMouHome.webp',
      '/logos/SVG/LogoheyMou.svg'
    ],
    scripts: [],
    stylesheets: []
  },

  // Pages to prefetch
  prefetchPages: [
    '/servicios',
    '/casos-exito',
    '/contacto'
  ]
} as const;

// Helper function to get rating based on metric value
export function getMetricRating(
  metricName: string, 
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_CONFIG.thresholds[metricName as keyof typeof PERFORMANCE_CONFIG.thresholds] ||
                   PERFORMANCE_CONFIG.customThresholds[metricName as keyof typeof PERFORMANCE_CONFIG.customThresholds];
  
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Helper function to check if metric should be sampled
export function shouldSampleMetric(metricType: keyof typeof PERFORMANCE_CONFIG.sampling): boolean {
  const samplingRate = PERFORMANCE_CONFIG.sampling[metricType];
  return Math.random() < samplingRate;
}

// Performance monitoring utilities
export const PerformanceUtils = {
  // Mark performance timing
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        return measure?.duration || 0;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Performance measurement failed:', error);
        }
        return 0;
      }
    }
    return 0;
  },

  // Get navigation timing
  getNavigationTiming: () => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation;
    }
    return null;
  },

  // Get resource timing
  getResourceTiming: (resourceUrl?: string) => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resourceUrl 
        ? resources.filter(resource => resource.name.includes(resourceUrl))
        : resources;
    }
    return [];
  },

  // Clear performance entries
  clearEntries: () => {
    if (typeof performance !== 'undefined' && performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
  }
};