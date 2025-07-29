'use client';

import { useState, useEffect } from 'react';

import { PERFORMANCE_CONFIG } from '../../lib/performance-config';

// Extended PerformanceEntry interface for LCP entries
interface LargestContentfulPaintEntry extends PerformanceEntry {
  value: number;
  element?: Element;
}

interface PerformanceData {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    inp?: number;
    pageLoadTime?: number;
    domContentLoaded?: number;
}

export default function PerformanceMonitor() {
    const [performanceData, setPerformanceData] = useState<PerformanceData>({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV !== 'development') return;

        // Listen for performance metrics
        const handlePerformanceEntry = (entry: PerformanceEntry) => {
            const value = entry.duration || (entry as LargestContentfulPaintEntry).value || 0;
            setPerformanceData(prev => ({
                ...prev,
                [entry.name]: value
            }));
        };

        // Observe performance entries
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(handlePerformanceEntry);
        });

        try {
            observer.observe({ entryTypes: ['measure', 'navigation', 'largest-contentful-paint'] });
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn('Performance Observer not supported:', error);
            }
        }

        // Get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
            setPerformanceData(prev => ({
                ...prev,
                pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                ttfb: navigation.responseStart - navigation.fetchStart
            }));
        }

        return () => observer.disconnect();
    }, []);

    // Toggle visibility with keyboard shortcut
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'P') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (process.env.NODE_ENV !== 'development' || !isVisible) {
        return null;
    }

    const getMetricColor = (value: number, metricName: string) => {
        const threshold = PERFORMANCE_CONFIG.thresholds[metricName as keyof typeof PERFORMANCE_CONFIG.thresholds] ||
            PERFORMANCE_CONFIG.customThresholds[metricName as keyof typeof PERFORMANCE_CONFIG.customThresholds];

        if (!threshold) return 'text-gray-600';

        if (value <= threshold.good) return 'text-green-600';
        if (value <= threshold.poor) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Performance Monitor
                </h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    ×
                </button>
            </div>

            <div className="space-y-2 text-xs">
                {performanceData.lcp && (
                    <div className="flex justify-between">
                        <span>LCP:</span>
                        <span className={getMetricColor(performanceData.lcp, 'LCP')}>
                            {Math.round(performanceData.lcp)}ms
                        </span>
                    </div>
                )}

                {performanceData.fcp && (
                    <div className="flex justify-between">
                        <span>FCP:</span>
                        <span className={getMetricColor(performanceData.fcp, 'FCP')}>
                            {Math.round(performanceData.fcp)}ms
                        </span>
                    </div>
                )}

                {performanceData.cls && (
                    <div className="flex justify-between">
                        <span>CLS:</span>
                        <span className={getMetricColor(performanceData.cls, 'CLS')}>
                            {performanceData.cls.toFixed(3)}
                        </span>
                    </div>
                )}

                {performanceData.ttfb && (
                    <div className="flex justify-between">
                        <span>TTFB:</span>
                        <span className={getMetricColor(performanceData.ttfb, 'TTFB')}>
                            {Math.round(performanceData.ttfb)}ms
                        </span>
                    </div>
                )}

                {performanceData.pageLoadTime && (
                    <div className="flex justify-between">
                        <span>Page Load:</span>
                        <span className={getMetricColor(performanceData.pageLoadTime, 'page_load_time')}>
                            {Math.round(performanceData.pageLoadTime)}ms
                        </span>
                    </div>
                )}

                {performanceData.domContentLoaded && (
                    <div className="flex justify-between">
                        <span>DOM Ready:</span>
                        <span className={getMetricColor(performanceData.domContentLoaded, 'dom_content_loaded')}>
                            {Math.round(performanceData.domContentLoaded)}ms
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Press Ctrl+Shift+P to toggle
                </p>
            </div>
        </div>
    );
}