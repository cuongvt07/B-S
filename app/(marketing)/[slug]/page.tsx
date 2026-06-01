import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { parseSeoSlug, isSeoLandingSlug } from '@/lib/utils/seoSlug';
import { listListings } from '@/lib/server-data';
import { ListingSlider } from '@/components/listing';
import { Breadcrumbs } from '@/components/seo';
import { SearchResults } from '@/components/search/SearchResults';
import { cityByCode } from '@/mocks/data/cities';
import { PROPERTY_TYPE_LABELS, SITE } from '@/lib/constants';
import type { ListingFilter } from '@/types';

interface PageProps {
  params: { slug: string };
}

function buildTitleFromParsed(parsed: ReturnType<typeof parseSeoSlug>): string {
  const tx = parsed.transactionType === 'rent' ? 'Cho thuê' : parsed.transactionType === 'sale' ? 'Mua bán' : 'Tin đăng';
  const pt = parsed.propertyType ? PROPERTY_TYPE_LABELS[parsed.propertyType] : 'bất động sản';
  const city = parsed.cityCode ? cityByCode.get(parsed.cityCode)?.name : '';
  return `${tx} ${pt}${city ? ` tại ${city}` : ''}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isSeoLandingSlug(params.slug)) return {};
  const parsed = parseSeoSlug(params.slug);
  const title = buildTitleFromParsed(parsed);
  const description = `Tổng hợp tin đăng ${title.toLowerCase()} mới nhất, giá tốt, đã xác thực — cập nhật liên tục trên ${SITE.name}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${params.slug}` },
    openGraph: { title, description },
  };
}

export default async function SeoLandingPage({ params }: PageProps) {
  if (!isSeoLandingSlug(params.slug)) notFound();
  const parsed = parseSeoSlug(params.slug);

  const filter: ListingFilter = {
    transactionType: parsed.transactionType,
    propertyType: parsed.propertyType,
    cityCode: parsed.cityCode,
    sort: 'newest',
    pageSize: 12,
  };

  const result = await listListings(filter);
  const title = buildTitleFromParsed(parsed);
  const city = parsed.cityCode ? cityByCode.get(parsed.cityCode) : undefined;

  return (
    <div className="container-app py-6">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tin đăng', href: '/tin-dang' },
          { label: title },
        ]}
      />

      <header className="mt-4 rounded-md border border-brdr bg-white p-6">
        <h1 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Tìm thấy <strong className="text-ink">{result.meta.total}</strong> tin đăng phù hợp
          {city ? ` tại ${city.name}` : ''}. Cập nhật mới nhất từ cộng đồng người đăng và môi giới xác thực.
        </p>
      </header>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Tin đăng nổi bật</h2>
        <ListingSlider listings={result.data} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Lọc thêm</h2>
        <Suspense fallback={null}>
          <SearchResults />
        </Suspense>
      </section>
    </div>
  );
}
