// Open Graph image generation utilities

export interface OGImageConfig {
  title: string;
  description?: string;
  locale: 'es' | 'en';
  type?: 'default' | 'article' | 'service' | 'success-story';
  author?: string;
  date?: string;
  tags?: string[];
}

// Generate Open Graph image URL
export function generateOGImageUrl(config: OGImageConfig): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com';
  
  // For now, return static images based on type
  // In the future, this could generate dynamic images using Vercel OG or similar
  const imageMap = {
    default: '/images/og-default.jpg',
    article: '/images/og-article.jpg',
    service: '/images/og-service.jpg',
    'success-story': '/images/og-success-story.jpg'
  };

  return `${baseUrl}${imageMap[config.type || 'default']}`;
}

// Generate dynamic OG image using API route (future implementation)
export function generateDynamicOGImage(config: OGImageConfig): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com';
  
  const params = new URLSearchParams({
    title: config.title,
    locale: config.locale,
    type: config.type || 'default',
    ...(config.description && { description: config.description }),
    ...(config.author && { author: config.author }),
    ...(config.date && { date: config.date }),
    ...(config.tags && { tags: config.tags.join(',') })
  });

  return `${baseUrl}/api/og?${params.toString()}`;
}

// Get optimized image dimensions for different social platforms
export function getImageDimensions(platform: 'facebook' | 'twitter' | 'linkedin' | 'default') {
  const dimensions = {
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 600 },
    linkedin: { width: 1200, height: 627 },
    default: { width: 1200, height: 630 }
  };

  return dimensions[platform];
}

// Generate image alt text based on content
export function generateImageAltText(config: OGImageConfig): string {
  const { title, type, locale } = config;
  
  const typeLabels = {
    es: {
      default: 'HeyMou - Tu Aliado Tecnológico',
      article: 'Artículo del blog de HeyMou',
      service: 'Servicio de HeyMou',
      'success-story': 'Caso de éxito de HeyMou'
    },
    en: {
      default: 'HeyMou - Your Technology Ally',
      article: 'HeyMou blog article',
      service: 'HeyMou service',
      'success-story': 'HeyMou success story'
    }
  };

  const typeLabel = typeLabels[locale][type || 'default'];
  return `${typeLabel}: ${title}`;
}

// Validate image URL and provide fallback
export function validateImageUrl(imageUrl?: string): string {
  const defaultImage = '/images/og-default.jpg';
  
  if (!imageUrl) return defaultImage;
  
  // Check if it's a valid URL format
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If it's a relative path, make it absolute
    if (imageUrl.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com';
      return `${baseUrl}${imageUrl}`;
    }
    
    return defaultImage;
  }
}

// Generate structured image data for JSON-LD
export function generateImageStructuredData(imageUrl: string, alt: string) {
  return {
    '@type': 'ImageObject',
    url: validateImageUrl(imageUrl),
    width: 1200,
    height: 630,
    alt: alt,
    caption: alt
  };
}