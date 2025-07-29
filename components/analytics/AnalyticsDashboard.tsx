'use client';

import { useState, useEffect, useCallback } from 'react';

import { Card } from '../ui/Card';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  topSources: Array<{ source: string; visitors: number }>;
  webVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  errors: Array<{
    message: string;
    count: number;
    lastOccurred: string;
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your analytics API
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Page Views"
          value={data.pageViews.toLocaleString()}
          icon="👁️"
        />
        <MetricCard
          title="Unique Visitors"
          value={data.uniqueVisitors.toLocaleString()}
          icon="👥"
        />
        <MetricCard
          title="Conversions"
          value={data.conversions.toLocaleString()}
          icon="🎯"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate.toFixed(2)}%`}
          icon="📈"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
          <div className="space-y-3">
            <WebVitalMetric
              name="LCP (Largest Contentful Paint)"
              value={data.webVitals.lcp}
              unit="ms"
              threshold={2500}
            />
            <WebVitalMetric
              name="FID (First Input Delay)"
              value={data.webVitals.fid}
              unit="ms"
              threshold={100}
            />
            <WebVitalMetric
              name="CLS (Cumulative Layout Shift)"
              value={data.webVitals.cls}
              unit=""
              threshold={0.1}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Avg. Session Duration</span>
              <span className="font-medium">
                {Math.floor(data.avgSessionDuration / 60)}m {data.avgSessionDuration % 60}s
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bounce Rate</span>
              <span className="font-medium">{data.bounceRate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Pages and Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <div className="space-y-2">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate">{page.path}</span>
                <span className="font-medium">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="space-y-2">
            {data.topSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{source.source}</span>
                <span className="font-medium">{source.visitors.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
        <div className="space-y-3">
          {data.errors.length > 0 ? (
            data.errors.map((error, index) => (
              <div key={index} className="flex justify-between items-start p-3 bg-red-50 rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error.message}</p>
                  <p className="text-xs text-red-600">Count: {error.count}</p>
                </div>
                <span className="text-xs text-red-600">{error.lastOccurred}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent errors</p>
          )}
        </div>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  );
}

interface WebVitalMetricProps {
  name: string;
  value: number;
  unit: string;
  threshold: number;
}

function WebVitalMetric({ name, value, unit, threshold }: WebVitalMetricProps) {
  const getRating = () => {
    if (value <= threshold) return 'good';
    if (value <= threshold * 2) return 'needs-improvement';
    return 'poor';
  };

  const rating = getRating();
  const colorClass = {
    good: 'text-green-600',
    'needs-improvement': 'text-yellow-600',
    poor: 'text-red-600',
  }[rating];

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{name}</span>
      <span className={`font-medium ${colorClass}`}>
        {value.toFixed(unit === 'ms' ? 0 : 3)}{unit}
      </span>
    </div>
  );
}