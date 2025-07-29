'use client';

import { cn } from '../../lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

// Typography components with consistent styling
export function TypographyH1({ children, className, as: Component = 'h1' }: TypographyProps) {
  return (
    <Component className={cn('typography-h1', className)}>
      {children}
    </Component>
  );
}

export function TypographyH2({ children, className, as: Component = 'h2' }: TypographyProps) {
  return (
    <Component className={cn('typography-h2', className)}>
      {children}
    </Component>
  );
}

export function TypographyH3({ children, className, as: Component = 'h3' }: TypographyProps) {
  return (
    <Component className={cn('typography-h3', className)}>
      {children}
    </Component>
  );
}

export function TypographyH4({ children, className, as: Component = 'h4' }: TypographyProps) {
  return (
    <Component className={cn('typography-h4', className)}>
      {children}
    </Component>
  );
}

export function TypographyH5({ children, className, as: Component = 'h5' }: TypographyProps) {
  return (
    <Component className={cn('typography-h5', className)}>
      {children}
    </Component>
  );
}

export function TypographyH6({ children, className, as: Component = 'h6' }: TypographyProps) {
  return (
    <Component className={cn('typography-h6', className)}>
      {children}
    </Component>
  );
}

export function TypographyBodyLarge({ children, className, as: Component = 'p' }: TypographyProps) {
  return (
    <Component className={cn('typography-body-large', className)}>
      {children}
    </Component>
  );
}

export function TypographyBody({ children, className, as: Component = 'p' }: TypographyProps) {
  return (
    <Component className={cn('typography-body', className)}>
      {children}
    </Component>
  );
}

export function TypographyBodySmall({ children, className, as: Component = 'p' }: TypographyProps) {
  return (
    <Component className={cn('typography-body-small', className)}>
      {children}
    </Component>
  );
}

export function TypographyCaption({ children, className, as: Component = 'span' }: TypographyProps) {
  return (
    <Component className={cn('typography-caption', className)}>
      {children}
    </Component>
  );
}

export function TypographyBadge({ children, className, as: Component = 'span' }: TypographyProps) {
  return (
    <Component className={cn('typography-badge', className)}>
      {children}
    </Component>
  );
}