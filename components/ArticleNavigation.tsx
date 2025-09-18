import Link from 'next/link';

import { BlogPost } from '../lib/blog';

interface ArticleNavigationProps {
  currentSlug: string;
  allPosts: BlogPost[];
  locale: 'es' | 'en';
}

export function ArticleNavigation({ currentSlug, allPosts, locale }: ArticleNavigationProps) {
  // Find current post index
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex === -1) return null;

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  if (!prevPost && !nextPost) return null;

  return (
    <nav className="flex items-center justify-between mt-12 pt-8 border-t border-border" aria-label="Navegación de artículos">
      <div className="flex-1">
        {prevPost && (
          <Link
            href={`/${locale}/blog/${prevPost.slug}`}
            className="group flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {locale === 'es' ? 'Artículo anterior' : 'Previous article'}
              </p>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {prevPost.title}
              </p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextPost && (
          <Link
            href={`/${locale}/blog/${nextPost.slug}`}
            className="group flex items-center justify-end gap-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="min-w-0 flex-1 text-right">
              <p className="text-sm text-muted-foreground mb-1">
                {locale === 'es' ? 'Siguiente artículo' : 'Next article'}
              </p>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {nextPost.title}
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}