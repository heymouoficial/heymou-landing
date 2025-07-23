import React from 'react';

import { cn } from '../../lib/utils';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  className,
  fullScreen = false
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderSpinner = () => (
    <svg
      className={cn('animate-spin text-primary', sizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full animate-pulse',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'bg-primary rounded-full animate-pulse',
        sizes[size]
      )}
    />
  );

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {renderVariant()}
      {text && (
        <p className={cn('text-gray-600 dark:text-gray-400 font-medium', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components
const LoadingSpinner: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="spinner" />
);

const LoadingDots: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="dots" />
);

const LoadingPulse: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="pulse" />
);

const LoadingSkeleton: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="skeleton" />
);

// Page loading component with branded styling
const PageLoading: React.FC<{ text?: string }> = ({ text = 'Cargando...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/5">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">Aliado Tecnológico</h2>
        <p className="text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  </div>
);

export { Loading, LoadingSpinner, LoadingDots, LoadingPulse, LoadingSkeleton, PageLoading };