import type { Metadata } from 'next';
import Link from 'next/link';
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
  FavoriteButton,
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

const STATUS_LABELS = {
  active: 'Đang hiển thị',
  pending: 'Chờ duyệt',
  expired: 'Hết hạn',
  sold: 'Đã giao dịch',
} as const;

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
    pageSize: 4,
  });
  const relatedListings = similar.data.filter((s) => s.id !== l.id).slice(0, 3);

  const ownerListingsResult = await listListings({ pageSize: 100 });
  const ownerListings = ownerListingsResult.data
    .filter((s) => s.ownerId === l.ownerId && s.id !== l.id)
    .slice(0, 4);

  const url = `${SITE.url}/tin-dang/${l.slug}`;
  const hasCoords = typeof l.lat === 'number' && typeof l.lng === 'number';
  const locationText = `${l.addressLine}, ${formatLocation(l.cityCode, l.districtCode, l.wardName)}`;
  const mapQuery = hasCoords ? `${l.lat},${l.lng}` : encodeURIComponent(locationText);

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
              <Badge variant={l.status === 'active' ? 'success' : l.status === 'sold' ? 'danger' : 'outline'}>
                {STATUS_LABELS[l.status]}
              </Badge>
              <Badge variant="outline">{l.transactionType === 'rent' ? 'Cho thuê' : 'Mua bán'}</Badge>
            </div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-semibold text-ink sm:text-2xl">{l.title}</h1>
              <FavoriteButton
                listingId={l.id}
                initialActive={l.isFavorited}
                className="static h-10 w-10 flex-shrink-0 border border-brdr"
              />
            </div>
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

          {hasCoords && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Vị trí trên bản đồ</h2>
              <div className="aspect-[16/9] overflow-hidden rounded-md border border-brdr">
                <iframe
                  title="Vị trí trên bản đồ"
                  src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            </section>
          )}

          {!hasCoords && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Vị trí trên bản đồ</h2>
              <div className="aspect-[16/9] overflow-hidden rounded-md border border-brdr">
                <iframe
                  title="Vị trí trên bản đồ"
                  src={`https://www.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                Tin này chưa có tọa độ chi tiết, bản đồ đang hiển thị theo địa chỉ khu vực.
              </p>
            </section>
          )}

          {l.videoUrl && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Video liên quan</h2>
              <div className="aspect-[16/9] overflow-hidden rounded-md border border-brdr bg-black">
                <iframe
                  title="Video tin đăng"
                  src={l.videoUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {l.tags.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Từ khóa</h2>
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

      {ownerListings.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Tin khác của {l.contact.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {ownerListingsResult.data.filter((s) => s.ownerId === l.ownerId).length} tin từ người này
              </p>
            </div>
            <Link
              href={`/nguoi-dang/${l.ownerId}`}
              className="unstyled inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ownerListings.map((r) => (
              <ListingCard key={r.id} listing={r} />
            ))}
          </div>
        </section>
      )}

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
