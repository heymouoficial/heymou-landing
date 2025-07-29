import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

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
  const localeDir = path.join(contentDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(localeDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        content,
        ...data,
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => {
    if (new Date(a.publishedAt) < new Date(b.publishedAt)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string, locale: 'es' | 'en' = 'es'): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, locale, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
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