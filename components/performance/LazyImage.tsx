'use client';

import { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

import { cn } from '../../lib/utils';

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  threshold?: number;
  rootMargin?: string;
  enableBlur?: boolean;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholder.jpg',
  threshold = 0.1,
  rootMargin = '50px',
  enableBlur = true,
  showPlaceholder = true,
  placeholderClassName,
  onLoadStart,
  onLoadComplete,
  onError,
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    }

    onError?.();
  };

  // Generate blur data URL
  const blurDataURL = enableBlur
    ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
    : undefined;

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Placeholder while not in view or loading */}
      {(!isInView || (isLoading && showPlaceholder)) && (
        <div
          className={cn(
            'absolute inset-0 bg-slate-200 dark:bg-slate-800',
            isLoading && 'animate-pulse',
            placeholderClassName
          )}
        >
          {isLoading && isInView && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <Image
          src={currentSrc}
          alt={alt}
          className={cn(
            'transition-all duration-500 ease-out',
            isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
            hasError && 'opacity-50'
          )}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={enableBlur ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          quality={props.quality || 85}
          sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          loading="lazy"
          {...props}
        />
      )}

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