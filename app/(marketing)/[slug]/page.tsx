import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { parseSeoSlug, isSeoLandingSlug } from '@/lib/utils/seoSlug';
import { getHomepageSections, listListings } from '@/lib/server-data';
import { ListingSlider } from '@/components/listing';
import { Breadcrumbs } from '@/components/seo';
import { SearchResults } from '@/components/search/SearchResults';
import { cityByCode } from '@/mocks/data/cities';
import { PROPERTY_TYPE_LABELS, SITE } from '@/lib/constants';
import type { Listing, ListingFilter } from '@/types';

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
    districtCode: parsed.districtCode,
    sort: 'newest',
    pageSize: 12,
  };

  const [result, homepageSections] = await Promise.all([
    listListings(filter),
    getHomepageSections(),
  ]);
  const homepageFeatured =
    homepageSections.find(
      (section) => section.sectionType === 'listings' && section.key.includes('featured')
    )?.listings ?? homepageSections.find((section) => section.sectionType === 'listings')?.listings ?? [];
  const matchingHomepageFeatured = homepageFeatured.filter((listing) =>
    matchesCategory(listing, filter)
  );
  const categoryListings = mergeListings(matchingHomepageFeatured, result.data);
  const featuredListings =
    categoryListings.length > 0 ? categoryListings.slice(0, 12) : homepageFeatured.slice(0, 12);
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

      <header className="relative mt-4 overflow-hidden rounded-md border border-brdr">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=70')",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand via-brand/80 to-brand/20" />
        <div className="relative z-10 p-6 text-white sm:p-8">
          <h1 className="text-xl font-semibold !text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] sm:text-2xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-white/90">
            Tìm thấy <strong className="text-white">{result.meta.total}</strong> tin đăng phù hợp
            {city ? ` tại ${city.name}` : ''}. Cập nhật mới nhất từ cộng đồng người đăng và môi giới xác thực.
          </p>
        </div>
      </header>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Tin đăng nổi bật</h2>
        <ListingSlider
          listings={featuredListings}
          emptyText="Chưa có tin đăng nổi bật phù hợp với danh mục này."
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Lọc thêm</h2>
        <Suspense fallback={null}>
          <SearchResults initialFilter={filter} />
        </Suspense>
      </section>
    </div>
  );
}

function matchesCategory(listing: Listing, filter: ListingFilter): boolean {
  if (filter.transactionType && listing.transactionType !== filter.transactionType) return false;
  if (filter.propertyType && listing.propertyType !== filter.propertyType) return false;
  if (filter.cityCode && listing.cityCode !== filter.cityCode) return false;
  if (filter.districtCode && listing.districtCode !== filter.districtCode) return false;
  return true;
}

function mergeListings(primary: Listing[], secondary: Listing[]): Listing[] {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((listing) => {
    if (seen.has(listing.id)) return false;
    seen.add(listing.id);
    return true;
  });
}
