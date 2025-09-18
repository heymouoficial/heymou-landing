'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: TOCItem[] = Array.from(elements).map((el, index) => ({
      id: el.id || `heading-${index}`,
      text: el.textContent || '',
      level: parseInt(el.tagName.charAt(1))
    }));
    setHeadings(tocItems);

    // Add IDs to headings that don't have them
    elements.forEach((el, index) => {
      if (!el.id) {
        el.id = `heading-${index}`;
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingElements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="toc bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto" aria-label="Tabla de contenidos">
      <h4 className="text-sm font-semibold mb-4 text-foreground">Tabla de Contenidos</h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-sm hover:text-primary transition-colors text-left w-full ${
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}