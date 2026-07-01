import Link from 'next/link';
import { ArrowRight, Building2, Car } from '@/components/icons';
import type { Blog } from '@/types';
import { BlogSlider } from '@/components/blog/BlogSlider';

interface BlogSplitData {
  bds: Blog[];
  xe: Blog[];
}

export function BlogStrip({ data }: { data: BlogSplitData }) {
  return (
    <section className="container-app py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* ── Cột trái: Tin BĐS ── */}
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold uppercase text-ink sm:text-2xl">
                <Building2 size={22} className="shrink-0 text-primary" />
                Tin bất động sản
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Thị trường, pháp lý, kinh nghiệm mua bán &amp; cho thuê
              </p>
            </div>
            <Link
              href="/blog?type=bds"
              className="unstyled inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <BlogSlider blogs={data.bds} emptyText="Chưa có tin bất động sản." />
        </div>

        {/* ── Cột phải: Tin Xe ── */}
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold uppercase text-ink sm:text-2xl">
                <Car size={22} className="shrink-0 text-primary" />
                Tin xe
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Đánh giá xe, mua bán, bảo dưỡng &amp; xu hướng mới
              </p>
            </div>
            <Link
              href="/blog?type=xe"
              className="unstyled inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <BlogSlider blogs={data.xe} emptyText="Chưa có tin xe." />
        </div>

      </div>
    </section>
  );
}