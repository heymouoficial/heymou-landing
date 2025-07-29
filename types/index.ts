// Core application types
export type Locale = 'es' | 'en';

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavigationProps {
  currentLocale: Locale;
  currentPath: string;
}

// Content types
export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'code' | 'quote' | 'list';
  content: any;
  metadata?: any;
}

export interface BlogPost {
  id: string;
  slug?: string;
  locale?: Locale;
  title: string;
  description: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  content?: {
    blocks: ContentBlock[];
  };
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    featuredImage?: string;
  };
  status?: 'draft' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogSectionData {
  badge: string;
  title: string;
  subtitle: string;
  categories: {
    all: string;
    strategy: string;
    development: string;
    automation: string;
    design: string;
    business: string;
  };
  readingTime: string;
  posts: BlogPost[];
  cta: {
    question: string;
    button: string;
  };
}

export interface SuccessStory {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  content: {
    challenge: string;
    solution: string;
    results: string[];
    testimonial?: {
      quote: string;
      author: string;
      position: string;
    };
  };
  metadata: {
    clientName: string;
    industry: string;
    projectDuration: string;
    technologies: string[];
    featuredImage?: string;
  };
  status: 'draft' | 'published';
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: 'web' | 'mobile' | 'automation' | 'consulting';
  message: string;
  budget?: string;
  timeline?: string;
  locale?: Locale;
}

// Component prop types
export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  backgroundImage?: string;
  locale: Locale;
}

export interface SuccessStoryProps {
  id: string;
  title: string;
  description: string;
  clientName: string;
  industry: string;
  results: string[];
  imageUrl?: string;
  locale: Locale;
}

export interface ContactFormProps {
  locale: Locale;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

// API types
export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Environment configuration
export interface EnvironmentConfig {
  NEXT_PUBLIC_BUILDSHIP_API_URL: string;
  BUILDSHIP_WEBHOOK_SECRET: string;
  ANALYTICS_ID?: string;
}
