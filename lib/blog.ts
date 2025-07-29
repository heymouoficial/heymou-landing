import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  author: string;
  content: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const contentDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPosts(locale: 'es' | 'en' = 'es'): BlogPost[] {
  try {
    const localeDir = path.join(contentDirectory, locale);
    
    if (!fs.existsSync(localeDir)) {
      console.warn(`Blog directory not found: ${localeDir}`);
      return [];
    }

    const fileNames = fs.readdirSync(localeDir);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        try {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(localeDir, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);

          return {
            slug,
            content,
            ...data,
          } as BlogPost;
        } catch (error) {
          console.error(`Error reading blog post ${fileName}:`, error);
          return null;
        }
      })
      .filter(Boolean) as BlogPost[];

    return allPostsData.sort((a, b) => {
      if (new Date(a.publishedAt) < new Date(b.publishedAt)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string, locale: 'es' | 'en' = 'es'): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, locale, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown content to HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content);
    
    const contentHtml = processedContent.toString();

    return {
      slug,
      content: contentHtml,
      ...data,
    } as BlogPost;
  } catch {
    return null;
  }
}

export function getFeaturedPosts(locale: 'es' | 'en' = 'es'): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts.filter(post => post.featured);
}

export function getPostsByCategory(category: string, locale: 'es' | 'en' = 'es'): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts.filter(post => post.category === category);
}