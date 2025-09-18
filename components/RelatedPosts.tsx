import Link from 'next/link';

import { BlogPost } from '../lib/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
  locale: 'es' | 'en';
}

export function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-border" aria-labelledby="related-posts-title">
      <h3
        id="related-posts-title"
        className="text-xl font-semibold mb-6 text-foreground"
      >
        {locale === 'es' ? 'Artículos relacionados' : 'Related Articles'}
      </h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <article
            key={post.id}
            className="group bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {post.readingTime} {locale === 'es' ? 'min' : 'min'}
              </span>
            </div>

            <h4 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {post.title}
              </Link>
            </h4>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {post.description}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{post.author}</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(
                  locale === 'es' ? 'es-ES' : 'en-US',
                  { month: 'short', day: 'numeric' }
                )}
              </time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}