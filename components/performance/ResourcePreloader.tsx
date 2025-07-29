'use client';

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  images?: string[];
  fonts?: Array<{
    href: string;
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
  scripts?: string[];
  stylesheets?: string[];
  prefetchUrls?: string[];
}

export default function ResourcePreloader({
  images = [],
  fonts = [],
  scripts = [],
  stylesheets = [],
  prefetchUrls = []
}: ResourcePreloaderProps) {
  useEffect(() => {
    const preloadedResources: HTMLLinkElement[] = [];

    // Preload critical images
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('data-preloader', 'true');
      document.head.appendChild(link);
      preloadedResources.push(link);
    });

    // Preload critical fonts
    fonts.forEach(({ href, type = 'font/woff2', crossOrigin = 'anonymous' }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = type;
      link.href = href;
      link.crossOrigin = crossOrigin;
      link.setAttribute('data-preloader', 'true');
      document.head.appendChild(link);
      preloadedResources.push(link);
    });

    // Preload critical scripts
    scripts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      link.setAttribute('data-preloader', 'true');
      document.head.appendChild(link);
      preloadedResources.push(link);
    });

    // Preload critical stylesheets
    stylesheets.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.setAttribute('data-preloader', 'true');
      document.head.appendChild(link);
      preloadedResources.push(link);
    });

    // Prefetch next-page resources
    prefetchUrls.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.setAttribute('data-preloader', 'true');
      document.head.appendChild(link);
      preloadedResources.push(link);
    });

    // Cleanup on unmount
    return () => {
      preloadedResources.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [images, fonts, scripts, stylesheets, prefetchUrls]);

  // This component doesn't render anything visible
  return null;
}

// Hook for dynamic resource preloading
export function useResourcePreloader() {
  const preloadImage = (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  };

  const preloadScript = (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  };

  const prefetchPage = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  };

  return {
    preloadImage,
    preloadScript,
    prefetchPage
  };
}