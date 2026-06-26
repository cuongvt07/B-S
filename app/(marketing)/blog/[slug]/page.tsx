import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar } from 'lucide-react';
import { getBlog, listBlogs } from '@/lib/server-data';
import { BlogContent, BlogTOC, BlogCard } from '@/components/blog';
import { Breadcrumbs, JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo';
import { formatTimeAgo } from '@/lib/utils/format';
import { SITE } from '@/lib/constants';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getBlog(params.slug);
  if (!result) return {};
  const b = result.data;
  return {
    title: b.title,
    description: b.excerpt,
    openGraph: {
      title: b.title,
      description: b.excerpt,
      images: [{ url: b.coverImage }],
      type: 'article',
      publishedTime: b.publishedAt,
      modifiedTime: b.updatedAt,
    },
    alternates: { canonical: `/blog/${b.slug}` },
  };
}

// ISR — cache the rendered article and revalidate at most every 5 minutes.
export const revalidate = 300;

export default async function BlogDetailPage({ params }: PageProps) {
  // Fetch the post and the related list in parallel.
  const [result, related] = await Promise.all([getBlog(params.slug), listBlogs({ pageSize: 4 })]);
  if (!result) notFound();
  const b = result.data;

  const relatedBlogs = related.data.filter((x) => x.id !== b.id).slice(0, 3);

  const url = `${SITE.url}/blog/${b.slug}`;

  return (
    <div className="container-app py-6">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: b.title },
        ]}
      />

      <article className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <header className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {b.categoryTag}
            </span>
            <h1 className="text-2xl font-semibold text-ink sm:text-4xl leading-tight">{b.title}</h1>
            <p className="text-base text-ink-muted">{b.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span>{b.authorName}</span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} /> {formatTimeAgo(b.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {b.readingMinutes} phút đọc
              </span>
            </div>
          </header>

          <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-brdr">
            <Image
              src={b.coverImage || '/bg/bg-3.jpg'}
              alt={b.title}
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
              priority
            />
          </div>

          <BlogContent markdown={b.content} />

          {b.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-brdr pt-4">
              <span className="text-xs font-semibold text-ink-muted">Tags:</span>
              {b.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-sm border border-brdr px-2 py-0.5 text-xs text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <BlogTOC markdown={b.content} />
      </article>

      {relatedBlogs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {relatedBlogs.map((r) => (
              <BlogCard key={r.id} blog={r} />
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={articleSchema({
          title: b.title,
          description: b.excerpt,
          image: b.coverImage,
          authorName: b.authorName,
          publishedAt: b.publishedAt,
          updatedAt: b.updatedAt,
          url,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Trang chủ', url: SITE.url },
          { name: 'Blog', url: `${SITE.url}/blog` },
          { name: b.title, url },
        ])}
      />
    </div>
  );
}
