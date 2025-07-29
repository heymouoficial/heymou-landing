import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com';
  
  // Static pages for both languages with enhanced metadata
  const staticPages = [
    { 
      path: '', 
      priority: 1.0, 
      changeFrequency: 'daily' as const,
      lastModified: new Date('2025-01-24') // Update when homepage content changes
    },
    { 
      path: '/servicios', 
      priority: 0.9, 
      changeFrequency: 'monthly' as const,
      lastModified: new Date('2025-01-24')
    },
    { 
      path: '/casos-exito', 
      priority: 0.8, 
      changeFrequency: 'weekly' as const,
      lastModified: new Date('2025-01-24')
    },
    { 
      path: '/blog', 
      priority: 0.8, 
      changeFrequency: 'weekly' as const,
      lastModified: new Date('2025-01-24')
    },
    { 
      path: '/sobre-mi', 
      priority: 0.7, 
      changeFrequency: 'monthly' as const,
      lastModified: new Date('2025-01-24')
    },
    { 
      path: '/contacto', 
      priority: 0.6, 
      changeFrequency: 'monthly' as const,
      lastModified: new Date('2025-01-24')
    }
  ];

  const locales = ['es', 'en'];
  
  // Generate sitemap entries for static pages
  const staticEntries: MetadataRoute.Sitemap = [];
  
  locales.forEach(locale => {
    staticPages.forEach(({ path, priority, changeFrequency, lastModified }) => {
      staticEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            es: `${baseUrl}/es${path}`,
            en: `${baseUrl}/en${path}`,
            'x-default': `${baseUrl}/es${path}` // Default to Spanish
          }
        }
      });
    });
  });

  // Add dynamic blog posts (when content management is implemented)
  try {
    const blogEntries = await generateBlogSitemapEntries(baseUrl);
    staticEntries.push(...blogEntries);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Failed to generate blog sitemap entries:', error);
    }
  }

  // Add dynamic success stories (when content management is implemented)
  try {
    const successStoryEntries = await generateSuccessStorySitemapEntries(baseUrl);
    staticEntries.push(...successStoryEntries);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Failed to generate success story sitemap entries:', error);
    }
  }

  // Add service-specific pages
  const servicePages = await generateServiceSitemapEntries(baseUrl);
  staticEntries.push(...servicePages);
  
  return staticEntries;
}

// Helper function to generate blog post sitemap entries
async function generateBlogSitemapEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  // TODO: Replace with actual database/CMS query when implemented
  // For now, return empty array
  const blogPosts: Array<{ slug: string; locale: string; lastModified: Date }> = [];
  
  return blogPosts.map(post => ({
    url: `${baseUrl}/${post.locale}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        es: `${baseUrl}/es/blog/${post.slug}`,
        en: `${baseUrl}/en/blog/${post.slug}`,
      }
    }
  }));
}

// Helper function to generate success story sitemap entries
async function generateSuccessStorySitemapEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  // TODO: Replace with actual database/CMS query when implemented
  // For now, return empty array
  const successStories: Array<{ slug: string; locale: string; lastModified: Date }> = [];
  
  return successStories.map(story => ({
    url: `${baseUrl}/${story.locale}/casos-exito/${story.slug}`,
    lastModified: story.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        es: `${baseUrl}/es/casos-exito/${story.slug}`,
        en: `${baseUrl}/en/casos-exito/${story.slug}`,
        'x-default': `${baseUrl}/es/casos-exito/${story.slug}`
      }
    }
  }));
}

// Helper function to generate service-specific sitemap entries
async function generateServiceSitemapEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const services = [
    { slug: 'desarrollo-web', priority: 0.8 },
    { slug: 'automatizacion', priority: 0.8 },
    { slug: 'estrategia-digital', priority: 0.8 },
    { slug: 'consultoria-tecnologica', priority: 0.8 }
  ];

  const locales = ['es', 'en'];
  const serviceEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    services.forEach(({ slug, priority }) => {
      serviceEntries.push({
        url: `${baseUrl}/${locale}/servicios/${slug}`,
        lastModified: new Date('2025-01-24'),
        changeFrequency: 'monthly' as const,
        priority,
        alternates: {
          languages: {
            es: `${baseUrl}/es/servicios/${slug}`,
            en: `${baseUrl}/en/services/${slug}`, // Different slug structure for English
            'x-default': `${baseUrl}/es/servicios/${slug}`
          }
        }
      });
    });
  });

  return serviceEntries;
}