'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button, SegmentedControl, Select } from '@/components/ui';
import { cities, cityByCode } from '@/mocks/data/cities';
import { PROPERTY_TYPE_LABELS, PRICE_BRACKETS_RENT } from '@/lib/constants';

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<'rent' | 'sale'>('rent');
  const [cityCode, setCityCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceBucket, setPriceBucket] = useState('');
  const [q, setQ] = useState('');

  const districtOptions = useMemo(() => {
    const city = cityCode ? cityByCode.get(cityCode) : undefined;
    return city ? city.districts.map((d) => ({ value: d.code, label: d.name })) : [];
  }, [cityCode]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('transactionType', tab);
    if (q.trim()) params.set('q', q.trim());
    if (cityCode) params.set('cityCode', cityCode);
    if (districtCode) params.set('districtCode', districtCode);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceBucket) {
      const idx = Number(priceBucket);
      const bracket = PRICE_BRACKETS_RENT[idx];
      if (bracket?.min) params.set('priceMin', String(bracket.min));
      if (bracket?.max) params.set('priceMax', String(bracket.max));
    }
    router.push(`/tin-dang?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-ink-strong">
      <Image
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80&auto=format&fit=crop"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover scale-105 motion-safe:animate-[float_12s_ease-in-out_infinite]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />

      <div className="relative container-app py-14 lg:py-24">
        <div className="mx-auto max-w-3xl text-center animate-slideUp">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl drop-shadow">
            Tìm ngôi nhà phù hợp cho bạn
          </h1>
          <p className="mt-3 text-base text-white/85 sm:text-lg">
            Hơn 20 tin đăng cho thuê và mua bán từ chủ nhà và môi giới xác thực.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 max-w-4xl rounded-md border border-brdr bg-white p-4 shadow-raised animate-slideUp"
          style={{ animationDelay: '120ms' }}
        >
          <div className="mb-3 flex justify-center">
            <SegmentedControl
              options={[
                { value: 'rent', label: 'Cho thuê' },
                { value: 'sale', label: 'Mua bán' },
              ]}
              value={tab}
              onChange={(v) => setTab(v as 'rent' | 'sale')}
              accent="primary"
            />
          </div>

          <div className="flex items-center rounded-sm border border-brdr px-3 py-2 focus-within:border-primary">
            <Search size={18} className="text-ink-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo địa điểm, dự án, đường..."
              className="ml-2 w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              options={cities.map((c) => ({ value: c.code, label: c.name }))}
              placeholder="Tỉnh / Thành phố"
              value={cityCode}
              onChange={(e) => {
                setCityCode(e.target.value);
                setDistrictCode('');
              }}
            />
            <Select
              options={districtOptions}
              placeholder="Quận / Huyện"
              value={districtCode}
              onChange={(e) => setDistrictCode(e.target.value)}
              disabled={!cityCode}
            />
            <Select
              options={Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
              placeholder="Loại BĐS"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            />
            <Select
              options={PRICE_BRACKETS_RENT.map((b, i) => ({ value: String(i), label: b.label }))}
              placeholder="Khoảng giá"
              value={priceBucket}
              onChange={(e) => setPriceBucket(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-1 text-xs text-ink-muted">
              <MapPin size={14} /> Phổ biến: TP.HCM, Hà Nội, Bình Dương, Đà Nẵng
            </p>
            <Button type="submit" leftIcon={<Search size={16} />}>
              Tìm kiếm
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
