'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Search, MapPin, Building2, BadgeDollarSign, ShieldCheck, Megaphone, ChevronDown } from 'lucide-react';
import { cities, cityByCode } from '@/mocks/data/cities';
import {
  PROPERTY_TYPE_LABELS,
  PRICE_BRACKETS_RENT,
  PRICE_BRACKETS_SALE,
} from '@/lib/constants';

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
];

type FilterKey = 'city' | 'district' | 'property' | 'price';

function FilterMenu({
  name,
  label,
  value,
  icon,
  open,
  disabled,
  onToggle,
  children,
  wide = false,
}: {
  name: FilterKey;
  label: string;
  value?: string;
  icon: ReactNode;
  open: boolean;
  disabled?: boolean;
  onToggle: (name: FilterKey) => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="home-search__filter">
      <button
        type="button"
        className="home-search__filter-button"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => onToggle(name)}
      >
        <span className="home-search__filter-icon">{icon}</span>
        <span className="min-w-0 flex-1 text-left">
          <small>{label}</small>
          <strong>{value || 'Tất cả'}</strong>
        </span>
        <ChevronDown size={15} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <div className={`home-search__menu${wide ? ' home-search__menu--wide' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<'rent' | 'sale'>('sale');
  const [cityCode, setCityCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceBucket, setPriceBucket] = useState('');
  const [q, setQ] = useState('');
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const priceBrackets = tab === 'sale' ? PRICE_BRACKETS_SALE : PRICE_BRACKETS_RENT;

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

  const selectedCity = cities.find((city) => city.code === cityCode)?.name;
  const selectedDistrict = districtOptions.find((district) => district.value === districtCode)?.label;
  const selectedProperty = propertyType ? PROPERTY_TYPE_LABELS[propertyType as keyof typeof PROPERTY_TYPE_LABELS] : undefined;
  const selectedPrice = priceBucket ? priceBrackets[Number(priceBucket)]?.label : undefined;

  function toggleFilter(name: FilterKey) {
    setOpenFilter((current) => (current === name ? null : name));
  }

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
      const bracket = priceBrackets[idx];
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
            <span className="home-room-banner__kicker">SÀN ĐĂNG TIN</span>
            <h1 className="home-room-banner__title">Bất động sản</h1>
            <p className="home-room-banner__tagline">Mua bán – Cho thuê – Đăng tin miễn phí</p>
            <div className="home-room-banner__features">
              <span className="home-room-banner__feature"><Building2 />Tin đăng đa dạng</span>
              <span className="home-room-banner__feature"><BadgeDollarSign />Giá bán minh bạch</span>
              <span className="home-room-banner__feature"><ShieldCheck />Thông tin minh bạch</span>
              <span className="home-room-banner__feature"><Megaphone />Đăng tin nhanh chóng</span>
            </div>
          </div>
          <div className="home-room-banner__photo">
            <Image
              key={BANNER_IMAGES[bannerIndex]}
              src={BANNER_IMAGES[bannerIndex]}
              alt="Bất động sản mua bán và cho thuê"
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
          className="home-search animate-slideUp"
          style={{ animationDelay: '120ms' }}
        >
          <div className="home-search__tabs" role="tablist" aria-label="Loại giao dịch">
            {(['sale', 'rent'] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => {
                  setTab(value);
                  setPriceBucket('');
                  setOpenFilter(null);
                }}
              >
                {value === 'sale' ? 'Mua bán' : 'Cho thuê'}
              </button>
            ))}
          </div>

          <div className="home-search__bar">
            <label className="home-search__keyword">
              <Search size={19} />
              <span>
                <small>Từ khóa</small>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Dự án, đường, khu vực..."
                />
              </span>
            </label>

            <FilterMenu name="city" label="Tỉnh / Thành phố" value={selectedCity} icon={<MapPin size={18} />} open={openFilter === 'city'} onToggle={toggleFilter}>
              <label className="home-search__option">
                <input type="radio" name="home-city" checked={!cityCode} onChange={() => { setCityCode(''); setDistrictCode(''); setOpenFilter(null); }} />
                <span>Tất cả tỉnh thành</span>
              </label>
              {cities.map((city) => (
                <label key={city.code} className="home-search__option">
                  <input type="radio" name="home-city" checked={cityCode === city.code} onChange={() => { setCityCode(city.code); setDistrictCode(''); setOpenFilter(null); }} />
                  <span>{city.name}</span>
                </label>
              ))}
            </FilterMenu>

            <FilterMenu name="district" label="Quận / Huyện" value={selectedDistrict} icon={<MapPin size={18} />} open={openFilter === 'district'} disabled={!cityCode} onToggle={toggleFilter}>
              <label className="home-search__option">
                <input type="radio" name="home-district" checked={!districtCode} onChange={() => { setDistrictCode(''); setOpenFilter(null); }} />
                <span>Tất cả quận huyện</span>
              </label>
              {districtOptions.map((district) => (
                <label key={district.value} className="home-search__option">
                  <input type="radio" name="home-district" checked={districtCode === district.value} onChange={() => { setDistrictCode(district.value); setOpenFilter(null); }} />
                  <span>{district.label}</span>
                </label>
              ))}
            </FilterMenu>

            <FilterMenu name="property" label="Loại bất động sản" value={selectedProperty} icon={<Building2 size={18} />} open={openFilter === 'property'} onToggle={toggleFilter}>
              <label className="home-search__option">
                <input type="radio" name="home-property" checked={!propertyType} onChange={() => { setPropertyType(''); setOpenFilter(null); }} />
                <span>Tất cả loại hình</span>
              </label>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                <label key={value} className="home-search__option">
                  <input type="radio" name="home-property" checked={propertyType === value} onChange={() => { setPropertyType(value); setOpenFilter(null); }} />
                  <span>{label}</span>
                </label>
              ))}
            </FilterMenu>

            <FilterMenu name="price" label="Khoảng giá" value={selectedPrice} icon={<BadgeDollarSign size={18} />} open={openFilter === 'price'} onToggle={toggleFilter} wide>
              <div className="home-search__price-grid">
                <label className="home-search__option">
                  <input type="radio" name="home-price" checked={!priceBucket} onChange={() => { setPriceBucket(''); setOpenFilter(null); }} />
                  <span>Tất cả mức giá</span>
                </label>
                {priceBrackets.map((bracket, index) => (
                  <label key={bracket.label} className="home-search__option">
                    <input type="radio" name="home-price" checked={priceBucket === String(index)} onChange={() => { setPriceBucket(String(index)); setOpenFilter(null); }} />
                    <span>{bracket.label}</span>
                  </label>
                ))}
              </div>
            </FilterMenu>

            <button type="submit" className="home-search__submit" aria-label="Tìm kiếm bất động sản">
              <Search size={19} />
              <span>Tìm kiếm</span>
            </button>
          </div>

          <p className="home-search__popular">
            <MapPin size={13} /> Phổ biến: TP.HCM, Hà Nội, Bình Dương, Đà Nẵng
          </p>
        </form>
      </div>
    </section>
  );
}
