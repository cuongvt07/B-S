import type { Metadata } from 'next';
import { BlogCard, BlogPagination } from '@/components/blog';
import { listBlogs } from '@/lib/server-data';

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: { page?: string; tag?: string };
}

function parsePage(raw?: string): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const page = parsePage(searchParams.page);
  const tag = searchParams.tag;
  // Keep ?page in the canonical so paginated pages aren't treated as duplicates of /blog.
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return {
    title: page > 1 ? `Blog bất động sản — Trang ${page}` : 'Blog bất động sản',
    description:
      'Tổng hợp kinh nghiệm thuê nhà, phân tích thị trường và pháp lý bất động sản — cập nhật liên tục.',
    alternates: { canonical: qs ? `/blog?${qs}` : '/blog' },
  };
}

// Reading `searchParams` opts this route into dynamic (SSR) rendering — correct for a
// paginated index. The underlying API fetch still uses `revalidate: 300`, so list data
// is cached for 5 minutes and the backend isn't hit on every request.
export default async function BlogListPage({ searchParams }: PageProps) {
  const page = parsePage(searchParams.page);
  const tag = searchParams.tag;
  const result = await listBlogs({ page, pageSize: PAGE_SIZE, tag });

  const { total, totalPages } = result.meta;
  // Featured hero only on the first page; subsequent pages are a plain grid.
  const isFirstPage = page <= 1;
  const [featured, ...rest] = result.data;
  const gridItems = isFirstPage ? rest : result.data;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (tag) params.set('tag', tag);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : '/blog';
  };

  return (
    <div className="container-app py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-4xl">Blog bất động sản</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {total} bài viết
          {totalPages > 1 ? ` · Trang ${page}/${totalPages}` : ' · Cập nhật mới nhất'}
        </p>
      </header>

      {result.data.length === 0 ? (
        <p className="rounded-md border border-brdr bg-surface-subtle p-8 text-center text-ink-muted">
          Chưa có bài viết nào.
        </p>
      ) : (
        <>
          {isFirstPage && featured && (
            <div className="mb-8">
              <BlogCard blog={featured} variant="featured" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>

          <BlogPagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
        </>
      )}
    </div>
  );
}
