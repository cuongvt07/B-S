import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Gauge, Settings2, Fuel, Palette, Users, MapPin, Phone } from '@/components/icons';
import { getVehicle, listVehicles } from '@/lib/server-data';
import { VehicleCard } from '@/components/vehicle';
import { Breadcrumbs } from '@/components/seo';
import { formatPrice, formatNumber, formatTimeAgo, maskPhone } from '@/lib/utils/format';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getVehicle(params.slug);
  if (!result) return {};
  const v = result.data;
  return {
    title: v.title,
    description: v.description?.slice(0, 160),
    openGraph: {
      title: v.title,
      images: v.images[0] ? [{ url: v.images[0].url }] : [],
      type: 'article',
    },
    alternates: { canonical: `/xe/${v.slug}` },
  };
}

// ISR — chi tiết xe ít đổi, cache 5 phút.
export const revalidate = 300;

export default async function VehicleDetailPage({ params }: PageProps) {
  const result = await getVehicle(params.slug);
  if (!result) notFound();
  const v = result.data;

  const related = await listVehicles({ vehicleType: v.vehicleType, pageSize: 4 });
  const relatedVehicles = related.data.filter((x) => x.id !== v.id).slice(0, 3);

  const location = [v.addressLine, v.districtName, v.cityName].filter(Boolean).join(', ');
  const cover = v.images[0]?.url;

  const specs: { icon: ReactNode; label: string; value?: string | number }[] = [
    { icon: <Calendar size={16} />, label: 'Năm sản xuất', value: v.year },
    { icon: <Gauge size={16} />, label: 'Số km đã đi', value: v.mileage !== undefined ? `${formatNumber(v.mileage)} km` : undefined },
    { icon: <Settings2 size={16} />, label: 'Hộp số', value: v.transmissionLabel },
    { icon: <Fuel size={16} />, label: 'Nhiên liệu', value: v.fuelTypeLabel },
    { icon: <Settings2 size={16} />, label: 'Dung tích/Phân khối', value: v.engineCapacity },
    { icon: <Palette size={16} />, label: 'Màu sắc', value: v.color },
    { icon: <Users size={16} />, label: 'Số chỗ', value: v.seats },
    { icon: <Calendar size={16} />, label: 'Tình trạng', value: v.conditionLabel },
    { icon: <MapPin size={16} />, label: 'Xuất xứ', value: v.originLabel },
  ].filter((s) => s.value !== undefined && s.value !== '' && s.value !== null);

  return (
    <div className="container-app py-6">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xe cộ', href: '/xe' },
          { label: v.vehicleTypeLabel, href: `/xe?loai=${v.vehicleType}` },
          { label: v.title },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-brdr bg-surface-subtle">
            {cover ? (
              <Image src={cover} alt={v.title} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-muted">Không có ảnh</div>
            )}
          </div>

          {v.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {v.images.slice(1, 9).map((img) => (
                <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-sm border border-brdr">
                  <Image src={img.url} alt={v.title} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <header className="space-y-2">
            <h1 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">{v.title}</h1>
            <div className="text-2xl font-bold text-price">
              {v.price > 0 ? formatPrice(v.price, 'total') : 'Thỏa thuận'}
            </div>
            {location && (
              <p className="flex items-center gap-1 text-sm text-ink-muted">
                <MapPin size={14} /> {location}
              </p>
            )}
            <p className="text-xs text-ink-muted">
              {v.vehicleTypeLabel} · {formatTimeAgo(v.createdAt)} · {v.viewCount} lượt xem
            </p>
          </header>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Thông số kỹ thuật</h2>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {specs.map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-brdr/60 pb-2">
                  <dt className="inline-flex items-center gap-2 text-sm text-ink-muted">
                    {s.icon} {s.label}
                  </dt>
                  <dd className="text-sm font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {v.description && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Mô tả</h2>
              <p className="whitespace-pre-line text-sm leading-6 text-ink">{v.description}</p>
            </section>
          )}
        </div>

        {/* Liên hệ */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-3 rounded-md border border-brdr bg-white p-4 shadow-raised">
          <div className="text-sm font-semibold text-ink">{v.contact.name || 'Người bán'}</div>
          {v.contact.phone ? (
            <a
              href={`tel:${v.contact.phone}`}
              className="flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <Phone size={16} /> {maskPhone(v.contact.phone)} · Gọi
            </a>
          ) : (
            <p className="text-sm text-ink-muted">Chưa có số liên hệ.</p>
          )}
          <p className="text-center text-xs text-ink-muted">Bấm gọi để xem số đầy đủ</p>
        </aside>
      </div>

      {relatedVehicles.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Xe tương tự</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {relatedVehicles.map((r) => (
              <VehicleCard key={r.id} vehicle={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
