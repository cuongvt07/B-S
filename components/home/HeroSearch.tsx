'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, House, BadgeDollarSign, ShieldCheck, Headphones } from 'lucide-react';
import { Button, SegmentedControl, Select } from '@/components/ui';
import { cities, cityByCode } from '@/mocks/data/cities';
import { PROPERTY_TYPE_LABELS, PRICE_BRACKETS_RENT } from '@/lib/constants';

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
];

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<'rent' | 'sale'>('rent');
  const [cityCode, setCityCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceBucket, setPriceBucket] = useState('');
  const [q, setQ] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setBannerIndex((current) => (current + 1) % BANNER_IMAGES.length),
      3000
    );
    return () => window.clearInterval(timer);
  }, []);

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
    <section className="bg-white py-5 lg:py-7">
      <div className="container-app">
        <div className="home-room-banner animate-slideUp">
          <div className="home-room-banner__content">
            <span className="home-room-banner__kicker">CHUYÊN</span>
            <h1 className="home-room-banner__title">Tìm phòng trọ</h1>
            <p className="home-room-banner__tagline">Nhanh chóng – Uy tín – Miễn phí</p>
            <div className="home-room-banner__features">
              <span className="home-room-banner__feature"><House />Phòng trọ đa dạng</span>
              <span className="home-room-banner__feature"><BadgeDollarSign />Giá cả hợp lý</span>
              <span className="home-room-banner__feature"><ShieldCheck />Thông tin minh bạch</span>
              <span className="home-room-banner__feature"><Headphones />Hỗ trợ tận tâm</span>
            </div>
          </div>
          <div className="home-room-banner__photo">
            <Image
              key={BANNER_IMAGES[bannerIndex]}
              src={BANNER_IMAGES[bannerIndex]}
              alt="Phòng trọ hiện đại, đầy đủ tiện nghi"
              fill
              priority
              sizes="(max-width: 768px) 55vw, 480px"
              className="home-room-banner__image"
            />
            <div className="home-room-banner__dots" aria-label="Chọn ảnh banner">
              {BANNER_IMAGES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Ảnh banner ${index + 1}`}
                  aria-current={index === bannerIndex}
                  onClick={() => setBannerIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative z-10 mx-auto -mt-3 max-w-5xl rounded-xl border border-brdr/80 bg-white/95 p-4 shadow-elevated backdrop-blur-sm animate-slideUp lg:-mt-4"
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
