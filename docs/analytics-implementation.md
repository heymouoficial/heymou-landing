# Analytics and Monitoring Implementation

This document describes the comprehensive analytics and monitoring system implemented for the HeyMou platform.

## Overview

The analytics system provides:
- **Performance Monitoring**: Core Web Vitals tracking and custom performance metrics
- **User Behavior Analytics**: Google Analytics 4 and privacy-focused Plausible integration
- **Error Monitoring**: Comprehensive error tracking and alerting system
- **Conversion Tracking**: Advanced form submission and lead generation tracking
- **Real-time Dashboard**: Internal analytics dashboard for monitoring key metrics

## Components

### 1. Analytics Provider (`AnalyticsProvider.tsx`)
Central component that initializes all analytics services and provides tracking context.

**Features:**
- Initializes Google Analytics and Plausible
- Sets up error monitoring
- Tracks page views automatically
- Provides analytics hooks for components

### 2. Event Tracker (`EventTracker.tsx`)
Automatic event tracking for user interactions.

**Tracked Events:**
- Button clicks and CTA interactions
- Form field focus/blur events
- Scroll depth milestones (25%, 50%, 75%, 90%, 100%)
- Time on page
- External link clicks
- Internal navigation

### 3. Web Vitals Monitoring (`WebVitals.tsx`)
Tracks Core Web Vitals performance metrics.

**Metrics Tracked:**
- **LCP** (Largest Contentful Paint)
- **FCP** (First Contentful Paint)
- **CLS** (Cumulative Layout Shift)
- **TTFB** (Time to First Byte)
- **INP** (Interaction to Next Paint)

### 4. Error Monitoring (`error-monitoring.ts`)
Comprehensive error tracking and reporting system.

**Features:**
- JavaScript error tracking
- API error monitoring
- Resource loading error detection
- Unhandled promise rejection tracking
- Rate limiting to prevent spam
- Critical error alerting

### 5. Conversion Tracking (`conversion-tracking.ts`)
Advanced form submission and conversion tracking.

**Features:**
- Form completion tracking
- Lead quality scoring
- Micro-conversion tracking
- Form abandonment analysis
- Validation error tracking
- Field-level interaction analytics

## Configuration

### Environment Variables

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your_ga_api_secret

# Plausible Analytics (Privacy-focused alternative)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=heymou.com

# Facebook Pixel
FACEBOOK_PIXEL_ID=123456789012345
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

# Error Monitoring
ERROR_MONITORING_WEBHOOK_URL=https://your-error-service.com/webhook
ERROR_MONITORING_API_KEY=your_api_key

# Slack Alerts
CRITICAL_ERROR_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK

# Marketing Automation
MARKETING_AUTOMATION_WEBHOOK_URL=https://your-platform.com/webhook
MARKETING_AUTOMATION_API_KEY=your_api_key
```

### Performance Thresholds

The system uses the following performance thresholds:

```typescript
const thresholds = {
  LCP: { good: 2500, poor: 4000 }, // ms
  FID: { good: 100, poor: 300 },   // ms
  CLS: { good: 0.1, poor: 0.25 },  // score
  FCP: { good: 1800, poor: 3000 }, // ms
  TTFB: { good: 800, poor: 1800 }, // ms
  INP: { good: 200, poor: 500 }    // ms
};
```

## API Endpoints

### `/api/analytics/web-vitals`
Receives and processes Core Web Vitals metrics.

**Payload:**
```json
{
  "name": "LCP",
  "value": 2100,
  "rating": "good",
  "id": "unique-metric-id",
  "url": "https://heymou.com/",
  "timestamp": 1640995200000
}
```

### `/api/analytics/errors`
Receives and processes error reports.

**Payload:**
```json
{
  "message": "TypeError: Cannot read property",
  "stack": "Error stack trace",
  "url": "https://heymou.com/contact",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session-id",
  "timestamp": 1640995200000
}
```

### `/api/analytics/conversions`
Receives and processes conversion events.

**Payload:**
```json
{
  "type": "contact_form",
  "formName": "contact_form",
  "formFields": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp"
  },
  "completionTime": 45000,
  "value": 85,
  "timestamp": 1640995200000
}
```

### `/api/analytics/dashboard`
Returns aggregated analytics data for the dashboard.

**Query Parameters:**
- `range`: `24h`, `7d`, or `30d`

## Usage Examples

### Track Custom Events

```typescript
import { useEventTracker } from '@/components/analytics/EventTracker';

function MyComponent() {
  const { trackCustomEvent } = useEventTracker();

  const handleButtonClick = () => {
    trackCustomEvent('button_click', 'engagement', 'hero_cta');
  };

  return <button onClick={handleButtonClick}>Get Started</button>;
}
```

### Track Form Interactions

```typescript
import { useFormTracking } from '@/lib/conversion-tracking';

function ContactForm() {
  const formTracking = useFormTracking('contact_form');

  const handleSubmit = async (formData) => {
    try {
      const response = await submitForm(formData);
      formTracking.trackFormSubmit(formData, true);
    } catch (error) {
      formTracking.trackFormSubmit(formData, false, error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onFocus={() => formTracking.trackFieldFocus('email')}
        onBlur={(e) => formTracking.trackFieldBlur('email', e.target.value)}
      />
    </form>
  );
}
```

### Monitor Performance

```typescript
import { trackCustomMetric } from '@/lib/analytics';

// Track component mount time
const startTime = performance.now();
useEffect(() => {
  const mountTime = performance.now() - startTime;
  trackCustomMetric('component_mount_time', mountTime);
}, []);
```

## Data Flow

1. **Client-side Events** → Analytics libraries (GA4, Plausible)
2. **Performance Metrics** → `/api/analytics/web-vitals` → Database/External services
3. **Error Events** → `/api/analytics/errors` → Error monitoring services
4. **Conversion Events** → `/api/analytics/conversions` → CRM/Marketing automation
5. **Dashboard Queries** → `/api/analytics/dashboard` → Aggregated data display

## Privacy Considerations

- **GDPR Compliance**: Plausible Analytics option for privacy-focused tracking
- **Data Minimization**: Only essential data is collected
- **User Consent**: Analytics can be disabled based on user preferences
- **Data Retention**: Configurable retention periods for different data types

## Monitoring and Alerts

### Critical Error Alerts
- Sent to Slack/Discord for immediate attention
- Triggered by 5xx API errors, security issues, or core component failures

### Performance Alerts
- Web Vitals threshold violations
- API response time degradation
- High error rates

### Conversion Alerts
- High-value lead notifications
- Form abandonment rate increases
- Conversion rate drops

## Testing

### Unit Tests
```bash
npm run test -- analytics
```

### Integration Tests
```bash
npm run test:integration -- analytics
```

### Performance Testing
```bash
npm run lighthouse
```

## Deployment

1. Set environment variables in your deployment platform
2. Configure webhook URLs for external services
3. Set up database tables for analytics data storage
4. Configure CDN for analytics script delivery
5. Set up monitoring dashboards

## Troubleshooting

### Common Issues

1. **Analytics not loading**: Check environment variables and script loading
2. **Events not tracking**: Verify event listener setup and network requests
3. **Performance metrics missing**: Check Web Vitals library loading
4. **Conversion tracking failing**: Verify API endpoints and payload format

### Debug Mode

Enable debug logging in development:
```bash
NODE_ENV=development npm run dev
```

This will log all analytics events to the browser console.

## Future Enhancements

- [ ] A/B testing framework integration
- [ ] Real-time analytics dashboard
- [ ] Advanced funnel analysis
- [ ] Predictive analytics for lead scoring
- [ ] Custom event tracking UI
- [ ] Performance budget monitoring
- [ ] Automated performance regression detection