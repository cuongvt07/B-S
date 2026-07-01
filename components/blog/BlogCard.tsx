import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/format';
import type { Blog } from '@/types';

const FALLBACK_COVER = '/bg/bg-3.jpg';

export function BlogCard({ blog, variant = 'normal' }: { blog: Blog; variant?: 'normal' | 'featured' }) {
  const isFeatured = variant === 'featured';
  const cover = blog.coverImage || FALLBACK_COVER;
  return (
    <article
      className={
        'group flex h-full flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-raised transition-shadow hover:shadow-elevated ' +
        (isFeatured ? 'md:flex-row' : '')
      }
    >
      <Link
        href={`/blog/${blog.slug}`}
        className={`unstyled relative block overflow-hidden ${
          isFeatured ? 'md:w-1/2 aspect-[16/9] md:aspect-auto' : 'aspect-[16/9]'
        }`}
      >
        <Image
          src={cover}
          alt={blog.title}
          fill
          sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className={`flex flex-1 flex-col gap-2 p-4 ${isFeatured ? 'md:p-6' : ''}`}>
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {blog.categoryTag}
        </span>
        <Link
          href={`/blog/${blog.slug}`}
          className={`unstyled font-semibold text-ink hover:text-primary ${
            isFeatured ? 'text-lg sm:text-xl' : 'text-base min-h-[44px]'
          } line-clamp-2`}
        >
          {blog.title}
        </Link>
        <p className={`text-sm text-ink-muted ${isFeatured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {blog.excerpt}
        </p>
        <div className="mt-auto space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span className="font-medium text-ink">{blog.authorName}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {blog.readingMinutes} phút · {formatTimeAgo(blog.publishedAt)}
            </span>
          </div>
          <Link
            href={`/blog/${blog.slug}`}
            className="unstyled inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Đọc thêm <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}