'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { PERFORMANCE_CONFIG } from '../../lib/performance-config';

// Network Information API interface
interface NetworkInformation {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// Extended Navigator interface
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

interface SmartPreloaderProps {
  enableIntersectionPreload?: boolean;
  enableHoverPreload?: boolean;
  enableIdlePreload?: boolean;
}

export default function SmartPreloader({
  enableIntersectionPreload = true,
  enableHoverPreload = true,
  enableIdlePreload = true
}: SmartPreloaderProps) {
  const pathname = usePathname();
  const preloadedUrls = useRef(new Set<string>());
  const idleCallbackId = useRef<number | NodeJS.Timeout | undefined>(undefined);

  // Preload a URL
  const preloadUrl = (url: string) => {
    if (preloadedUrls.current.has(url)) return;
    
    preloadedUrls.current.add(url);
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.setAttribute('data-smart-preloader', 'true');
    document.head.appendChild(link);
  };

  // Preload critical resources on mount
  useEffect(() => {
    // Preload critical fonts
    PERFORMANCE_CONFIG.criticalResources.fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = font.type;
      link.href = font.href;
      if (font.crossOrigin) {
        link.crossOrigin = font.crossOrigin;
      }
      link.setAttribute('data-smart-preloader', 'true');
      document.head.appendChild(link);
    });

    // Preload critical images
    PERFORMANCE_CONFIG.criticalResources.images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('data-smart-preloader', 'true');
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup preloaded resources
      const preloadedElements = document.querySelectorAll('[data-smart-preloader="true"]');
      preloadedElements.forEach(element => element.remove());
    };
  }, []);

  // Intersection-based preloading
  useEffect(() => {
    if (!enableIntersectionPreload) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.href;
            
            if (href && href !== window.location.href) {
              preloadUrl(href);
            }
          }
        });
      },
      {
        rootMargin: '100px'
      }
    );

    // Observe all internal links
    const links = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
    links.forEach(link => observer.observe(link));

    return () => observer.disconnect();
  }, [pathname, enableIntersectionPreload]);

  // Hover-based preloading
  useEffect(() => {
    if (!enableHoverPreload) return;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const href = target.href;
        if (href !== window.location.href && !href.includes('#')) {
          preloadUrl(href);
        }
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    return () => document.removeEventListener('mouseenter', handleMouseEnter, true);
  }, [enableHoverPreload]);

  // Idle-time preloading
  useEffect(() => {
    if (!enableIdlePreload) return;

    const preloadOnIdle = () => {
      // Preload configured pages during idle time
      PERFORMANCE_CONFIG.prefetchPages.forEach(page => {
        if (!preloadedUrls.current.has(page)) {
          preloadUrl(page);
        }
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      idleCallbackId.current = window.requestIdleCallback(preloadOnIdle, {
        timeout: 2000
      });
    } else {
      idleCallbackId.current = setTimeout(preloadOnIdle, 2000);
    }

    return () => {
      if (idleCallbackId.current) {
        if ('cancelIdleCallback' in window && typeof idleCallbackId.current === 'number') {
          window.cancelIdleCallback(idleCallbackId.current);
        } else if (idleCallbackId.current) {
          clearTimeout(idleCallbackId.current);
        }
      }
    };
  }, [pathname, enableIdlePreload]);

  // Preload based on user's connection
  useEffect(() => {
    const navigatorWithConnection = navigator as NavigatorWithConnection;
    const connection = navigatorWithConnection.connection;
    
    if (connection) {
      // Only preload on fast connections
      const isFastConnection = connection.effectiveType === '4g' && connection.downlink > 1.5;
      
      if (!isFastConnection) {
        // Disable aggressive preloading on slow connections
        const prefetchLinks = document.querySelectorAll('link[rel="prefetch"][data-smart-preloader="true"]');
        prefetchLinks.forEach(link => link.remove());
      }
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Hook for manual preloading
export function useSmartPreloader() {
  const preloadedUrls = useRef(new Set<string>());

  const preloadPage = (url: string) => {
    if (preloadedUrls.current.has(url)) return;
    
    preloadedUrls.current.add(url);
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  };

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

  return {
    preloadPage,
    preloadImage
  };
}