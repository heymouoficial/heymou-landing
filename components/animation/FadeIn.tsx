'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  x?: number;
  duration?: number;
}

export function FadeIn({
  children,
  delay = 0.2,
  className = '',
  y = 0,
  x = 0,
  duration = 0.6,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, x: 0, filter: 'blur(0)' }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay,
        duration,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}