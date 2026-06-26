import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Blog } from '@/types';
import { BlogSlider } from '@/components/blog/BlogSlider';

export function BlogStrip({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="container-app py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold uppercase text-ink sm:text-2xl">Blog bất động sản</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Kinh nghiệm, phân tích thị trường và pháp lý cập nhật
          </p>
        </div>
        <Link
          href="/blog"
          className="unstyled inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>
      <BlogSlider blogs={blogs} />
    </section>
  );
}
