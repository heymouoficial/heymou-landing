import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';
import gfm from 'remark-gfm';

export interface BlogPost {
  id: string;
  slug?: string;
  locale?: 'es' | 'en';
  title: string;
  description: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  content?: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    featuredImage?: string;
  };
  status?: 'draft' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
}

// Function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Function to get all posts for a locale
export function getAllPosts(locale: 'es' | 'en' = 'es'): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog', locale);

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
          id: slug,
          slug,
          title: matterResult.data.title || '',
          description: matterResult.data.description || '',
          category: matterResult.data.category || 'general',
          readingTime: matterResult.data.readingTime || calculateReadingTime(matterResult.content),
          publishedAt: matterResult.data.publishedAt || new Date().toISOString(),
          featured: matterResult.data.featured || false,
          tags: matterResult.data.tags || [],
          author: matterResult.data.author || 'HeyMou',
          seo: matterResult.data.seo || {
            title: matterResult.data.title || '',
            description: matterResult.data.description || '',
            keywords: ''
          },
          content: matterResult.content
        } as BlogPost;
      });

    // Sort posts by published date (newest first)
    return allPostsData.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// Function to get a single post by slug
export async function getPostBySlug(slug: string, locale: 'es' | 'en' = 'es'): Promise<BlogPost | null> {
  try {
    const postsDirectory = path.join(process.cwd(), 'content', 'blog', locale);
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Process markdown content to HTML with enhanced features
    const processedContent = await remark()
      .use(gfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypePrism, { ignoreMissing: true })
      .use(rehypeStringify)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      id: slug,
      slug,
      title: matterResult.data.title || '',
      description: matterResult.data.description || '',
      category: matterResult.data.category || 'general',
      readingTime: matterResult.data.readingTime || calculateReadingTime(matterResult.content),
      publishedAt: matterResult.data.publishedAt || new Date().toISOString(),
      featured: matterResult.data.featured || false,
      tags: matterResult.data.tags || [],
      author: matterResult.data.author || 'HeyMou',
      seo: matterResult.data.seo || {
        title: matterResult.data.title || '',
        description: matterResult.data.description || '',
        keywords: ''
      },
      content: contentHtml
    } as BlogPost;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error reading post:', error);
    return null;
  }
}

// Function to get posts by category
export function getPostsByCategory(category: string, locale: 'es' | 'en' = 'es'): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts.filter(post => post.category === category);
}

// Function to get featured posts
export function getFeaturedPosts(locale: 'es' | 'en' = 'es'): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts.filter(post => post.featured);
}

// Function to get related posts (same category, excluding current post)
export function getRelatedPosts(currentSlug: string, category: string, locale: 'es' | 'en' = 'es', limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}

// Function to search posts by query
export function searchPosts(query: string, locale: 'es' | 'en' = 'es'): BlogPost[] {
  const allPosts = getAllPosts(locale);
  const lowercaseQuery = query.toLowerCase();

  return allPosts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.category.toLowerCase().includes(lowercaseQuery)
  );
}