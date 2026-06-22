'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils/slugify';
import { isHtmlContent, extractHtmlHeadings } from '@/lib/utils/richtext';

interface TOCItem {
  level: 2 | 3;
  text: string;
  id: string;
}

function parseTOC(markdown: string): TOCItem[] {
  if (isHtmlContent(markdown)) return extractHtmlHeadings(markdown);
  const lines = markdown.split('\n');
  const items: TOCItem[] = [];
  for (const line of lines) {
    const m2 = line.match(/^##\s+(.+)$/);
    const m3 = line.match(/^###\s+(.+)$/);
    if (m2) items.push({ level: 2, text: m2[1].trim(), id: slugify(m2[1]) });
    else if (m3) items.push({ level: 3, text: m3[1].trim(), id: slugify(m3[1]) });
  }
  return items;
}

export function BlogTOC({ markdown }: { markdown: string }) {
  const [items] = useState(() => parseTOC(markdown));
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="rounded-md border border-brdr bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Mục lục
        </p>
        <ul className="space-y-1 text-sm">
          {items.map((it) => (
            <li key={it.id} className={cn(it.level === 3 && 'pl-3')}>
              <a
                href={`#${it.id}`}
                className={cn(
                  'unstyled block py-1 text-ink-muted hover:text-primary',
                  activeId === it.id && 'font-semibold text-primary'
                )}
              >
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
