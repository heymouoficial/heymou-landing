import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SiteHeader } from '../../../../../components/layout/SiteHeader';
import SiteFooter from '../../../../../components/layout/SiteFooter';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '../../../../../lib/blog';
import { TableOfContents } from '../../../../../components/TableOfContents';
import { ReadingProgress } from '../../../../../components/ReadingProgress';
import { RelatedPosts } from '../../../../../components/RelatedPosts';
import { ArticleNavigation } from '../../../../../components/ArticleNavigation';

type Props = {
  params: Promise<{ locale: 'es' | 'en'; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  
  if (!post) {
    return {
      title: 'Post not found | HeyMou',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author || 'HeyMou'],
      tags: post.tags,
    },
  };
}

export async function generateStaticParams() {
  const esSlugParams = getAllPosts('es').map((post) => ({
    locale: 'es' as const,
    slug: post.slug,
  }));
  
  const enSlugParams = getAllPosts('en').map((post) => ({
    locale: 'en' as const,
    slug: post.slug,
  }));

  return [...esSlugParams, ...enSlugParams];
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = getRelatedPosts(slug, post.category, locale, 3);

  // Get all posts for navigation
  const allPosts = getAllPosts(locale);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <article className="max-w-4xl mx-auto lg:mx-0" role="main" aria-labelledby="article-title">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  {post.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {post.readingTime} {locale === 'es' ? 'min de lectura' : 'min read'}
                </span>
              </div>

              <h1
                id="article-title"
                className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
              >
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.description}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span>•</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(
                      locale === 'es' ? 'es-ES' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    )}
                  </time>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Content */}
            <div
              className="prose prose-invert prose-lg max-w-none prose-custom"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Article Navigation */}
            <ArticleNavigation currentSlug={slug} allPosts={allPosts} locale={locale} />

            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} locale={locale} />

            {/* Back to Home */}
            <div className="mt-16 pt-8 border-t border-border">
              <a
                href={`/${locale}#blog`}
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
              </a>
            </div>
          </article>

          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}