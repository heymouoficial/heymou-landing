import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

import { cn } from '../../lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  enableBlur?: boolean;
  blurDataURL?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  preload?: boolean;
  onLoadComplete?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholder.jpg',
  showPlaceholder = true,
  placeholderClassName,
  enableBlur = true,
  blurDataURL,
  aspectRatio,
  objectFit = 'cover',
  preload = false,
  onLoadComplete,
  onError: onErrorCallback,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);

  // Track image loading performance
  useEffect(() => {
    setLoadStartTime(performance.now());
  }, [src]);

  // Preload image if requested
  useEffect(() => {
    if (preload && typeof src === 'string') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
    return undefined;
  }, [src, preload]);

  const handleLoad = () => {
    setIsLoading(false);
    
    // Track loading performance
    if (loadStartTime > 0) {
      const loadTime = performance.now() - loadStartTime;
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'image_load_time', {
          event_category: 'Performance',
          event_label: typeof src === 'string' ? src : 'dynamic',
          value: Math.round(loadTime)
        });
      }
    }
    
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Track image errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_error', {
        event_category: 'Error',
        event_label: typeof src === 'string' ? src : 'dynamic'
      });
    }
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    }
    
    onErrorCallback?.();
  };

  // Generate blur data URL if not provided
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    if (!enableBlur) return undefined;
    
    // Simple base64 blur placeholder
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  };

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={containerStyle}
    >
      {/* Loading placeholder */}
      {isLoading && showPlaceholder && (
        <div
          className={cn(
            'absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse',
            'flex items-center justify-center',
            placeholderClassName
          )}
        >
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Actual image */}
      <Image
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          hasError && 'opacity-50',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down'
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={props.priority}
        quality={props.quality || 85}
        sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        placeholder={enableBlur ? 'blur' : 'empty'}
        blurDataURL={getBlurDataURL()}
        loading={props.priority ? 'eager' : 'lazy'}
        {...props}
      />
      
      {/* Error state */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Note: gtag types are declared globally in lib/gtag.ts