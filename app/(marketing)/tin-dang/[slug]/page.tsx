import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Maximize2, BedDouble, Bath, Compass, Sofa, Eye, Calendar } from 'lucide-react';
import { getListing, listListings } from '@/lib/server-data';
import {
  ListingGallery,
  AmenityList,
  ContactSidebar,
  ListingCard,
  TrackRecentlyViewed,
  RecentlyViewed,
} from '@/components/listing';
import { Badge } from '@/components/ui';
import { Breadcrumbs, JsonLd, listingSchema, breadcrumbSchema } from '@/components/seo';
import { formatPrice, formatArea, formatTimeAgo, formatNumber } from '@/lib/utils/format';
import { extractIdFromSlug } from '@/lib/utils/slugify';
import { formatLocation, cityByCode } from '@/mocks/data/cities';
import { DIRECTION_LABELS, FURNISH_LABELS, PROPERTY_TYPE_LABELS, SITE } from '@/lib/constants';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = extractIdFromSlug(params.slug);
  if (!id) return {};
  const result = await getListing(id);
  if (!result) return {};
  const l = result.data;
  const desc = l.description.slice(0, 160);
  return {
    title: l.title,
    description: desc,
    openGraph: {
      title: l.title,
      description: desc,
      images: l.images.slice(0, 1).map((i) => ({ url: i.url })),
    },
    alternates: { canonical: `/tin-dang/${l.slug}` },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const id = extractIdFromSlug(params.slug);
  if (!id) notFound();
  const result = await getListing(id);
  if (!result) notFound();
  const l = result.data;
  const city = cityByCode.get(l.cityCode);

  const similar = await listListings({
    propertyType: l.propertyType,
    cityCode: l.cityCode,
    pageSize: 3,
  });
  const relatedListings = similar.data.filter((s) => s.id !== l.id).slice(0, 3);

  const url = `${SITE.url}/tin-dang/${l.slug}`;

  return (
    <div className="container-app py-6">
      <TrackRecentlyViewed listingId={l.id} />
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tin đăng', href: '/tin-dang' },
          { label: city?.name ?? '', href: `/tin-dang?cityCode=${l.cityCode}` },
          { label: l.title },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <article className="space-y-6">
          <ListingGallery images={l.images} title={l.title} />

          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {l.vipTier !== 'normal' && (
                <Badge variant="vip">VIP {l.vipTier.replace('vip', '')}</Badge>
              )}
              <Badge variant="outline">{PROPERTY_TYPE_LABELS[l.propertyType]}</Badge>
              <Badge variant="outline">{l.transactionType === 'rent' ? 'Cho thuê' : 'Mua bán'}</Badge>
            </div>
            <h1 className="text-xl font-semibold text-ink sm:text-2xl">{l.title}</h1>
            <p className="inline-flex items-start gap-1 text-sm text-ink-muted">
              <MapPin size={14} className="mt-0.5" />
              {l.addressLine}, {formatLocation(l.cityCode, l.districtCode, l.wardName)}
            </p>
          </header>

          <section className="rounded-md border border-brdr bg-white p-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-ink-muted">Giá</dt>
                <dd className="font-semibold text-price">
                  {formatPrice(l.price, l.priceUnit)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Diện tích</dt>
                <dd className="font-semibold inline-flex items-center gap-1">
                  <Maximize2 size={14} /> {formatArea(l.area)}
                </dd>
              </div>
              {l.bedrooms ? (
                <div>
                  <dt className="text-ink-muted">Phòng ngủ</dt>
                  <dd className="font-semibold inline-flex items-center gap-1">
                    <BedDouble size={14} /> {l.bedrooms}
                  </dd>
                </div>
              ) : null}
              {l.bathrooms ? (
                <div>
                  <dt className="text-ink-muted">Phòng tắm</dt>
                  <dd className="font-semibold inline-flex items-center gap-1">
                    <Bath size={14} /> {l.bathrooms}
                  </dd>
                </div>
              ) : null}
              {l.direction ? (
                <div>
                  <dt className="text-ink-muted">Hướng</dt>
                  <dd className="font-semibold inline-flex items-center gap-1">
                    <Compass size={14} /> {DIRECTION_LABELS[l.direction]}
                  </dd>
                </div>
              ) : null}
              {l.furnish ? (
                <div>
                  <dt className="text-ink-muted">Nội thất</dt>
                  <dd className="font-semibold inline-flex items-center gap-1">
                    <Sofa size={14} /> {FURNISH_LABELS[l.furnish]}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-ink-muted">Lượt xem</dt>
                <dd className="font-semibold inline-flex items-center gap-1">
                  <Eye size={14} /> {formatNumber(l.viewCount)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Đăng</dt>
                <dd className="font-semibold inline-flex items-center gap-1">
                  <Calendar size={14} /> {formatTimeAgo(l.createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Mô tả chi tiết</h2>
            <div className="whitespace-pre-line rounded-md border border-brdr bg-white p-4 text-sm leading-relaxed text-ink">
              {l.description}
            </div>
          </section>

          {l.amenities.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Tiện ích</h2>
              <div className="rounded-md border border-brdr bg-white p-4">
                <AmenityList amenities={l.amenities} />
              </div>
            </section>
          )}

          {l.lat && l.lng && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Vị trí</h2>
              <div className="aspect-[16/9] overflow-hidden rounded-md border border-brdr">
                <iframe
                  title="Vị trí trên bản đồ"
                  src={`https://www.google.com/maps?q=${l.lat},${l.lng}&z=15&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            </section>
          )}

          {l.tags.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {l.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </article>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <ContactSidebar listing={l} />
        </div>
      </div>

      {relatedListings.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Tin đăng tương tự</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedListings.map((r) => (
              <ListingCard key={r.id} listing={r} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed excludeId={l.id} />

      <JsonLd
        data={listingSchema({
          id: l.id,
          title: l.title,
          description: l.description,
          images: l.images,
          price: l.price,
          priceUnit: l.priceUnit,
          area: l.area,
          addressLine: l.addressLine,
          cityName: city?.name ?? '',
          url,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Trang chủ', url: SITE.url },
          { name: 'Tin đăng', url: `${SITE.url}/tin-dang` },
          { name: l.title, url },
        ])}
      />
    </div>
  );
}
