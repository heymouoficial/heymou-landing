import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { getPostBySlug, getAllPosts } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{
    locale: 'es' | 'en';
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
        >
          ← {locale === 'es' ? 'Volver al Home' : 'Back to Home'}
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          {/* Category & Reading Time */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {post.readingTime} {locale === 'es' ? 'min de lectura' : 'min read'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="flex items-center gap-4">
              <span className="font-medium text-foreground">{post.author}</span>
              <time dateTime={post.publishedAt} className="text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-invert">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold text-foreground mt-12 mb-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold text-foreground mt-8 mb-3">{children}</h3>,
              p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-6">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-muted-foreground mb-6 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary bg-primary/5 pl-6 py-4 my-8 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-muted text-foreground px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted text-foreground p-6 rounded-lg overflow-x-auto my-8">
                  {children}
                </pre>
              ),
              strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-primary hover:text-primary/80 underline transition-colors"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-primary/5 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {locale === 'es' 
              ? '¿Te gustó este artículo?' 
              : 'Did you like this article?'
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {locale === 'es'
              ? 'Hablemos de cómo puedo ayudarte con tu proyecto tecnológico'
              : 'Let\'s talk about how I can help you with your tech project'
            }
          </p>
          <Link
            href={`mailto:hola@heymou.com?subject=${encodeURIComponent(post.title)}`}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {locale === 'es' ? 'Trabajemos Juntos' : 'Let\'s Work Together'}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}