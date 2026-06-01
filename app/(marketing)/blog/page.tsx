import type { Metadata } from 'next';
import { BlogCard } from '@/components/blog';
import { listBlogs } from '@/lib/server-data';

export const metadata: Metadata = {
  title: 'Blog bất động sản',
  description: 'Tổng hợp kinh nghiệm thuê nhà, phân tích thị trường và pháp lý bất động sản — cập nhật liên tục.',
};

export default async function BlogListPage() {
  const result = await listBlogs({ pageSize: 20 });
  const [featured, ...rest] = result.data;

  return (
    <div className="container-app py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-4xl">Blog bất động sản</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {result.meta.total} bài viết · Cập nhật mới nhất
        </p>
      </header>

      {featured && (
        <div className="mb-8">
          <BlogCard blog={featured} variant="featured" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((b) => (
          <BlogCard key={b.id} blog={b} />
        ))}
      </div>
    </div>
  );
}
