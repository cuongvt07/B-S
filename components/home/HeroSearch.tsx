'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Search, MapPin, Building2, BadgeDollarSign, Sparkles, ChevronDown } from '@/components/icons';
import { cities, cityByCode } from '@/mocks/data/cities';
import {
  PROPERTY_TYPE_LABELS,
  PRICE_BRACKETS_RENT,
  PRICE_BRACKETS_SALE,
  VEHICLE_TYPE_LABELS,
  VEHICLE_PRICE_BRACKETS,
} from '@/lib/constants';

const BANNER_IMAGES = ['/bg/bg-1.jpg', '/bg/bg-6.jpg', '/bg/bg-2.jpg'];

type FilterKey = 'city' | 'district' | 'property' | 'price' | 'vehicleType' | 'vehiclePrice';
type Vertical = 'property' | 'vehicle';

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
  const [vertical, setVertical] = useState<Vertical>('property');
  const [tab, setTab] = useState<'rent' | 'sale'>('sale');
  const [cityCode, setCityCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceBucket, setPriceBucket] = useState('');
  // Xe cộ
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [q, setQ] = useState('');
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const priceBrackets = tab === 'sale' ? PRICE_BRACKETS_SALE : PRICE_BRACKETS_RENT;

  const selectedVehicleType = vehicleType
    ? VEHICLE_TYPE_LABELS[vehicleType as keyof typeof VEHICLE_TYPE_LABELS]
    : undefined;
  const selectedVehiclePrice = vehiclePrice ? VEHICLE_PRICE_BRACKETS[Number(vehiclePrice)]?.label : undefined;

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

    if (vertical === 'vehicle') {
      const params = new URLSearchParams();
      if (vehicleType) params.set('loai', vehicleType);
      if (q.trim()) params.set('q', q.trim());
      if (vehiclePrice) params.set('gia', vehiclePrice);
      const qs = params.toString();
      router.push(qs ? `/xe?${qs}` : '/xe');
      return;
    }

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
            <span className="home-room-banner__kicker">
              <Sparkles size={13} /> Nền tảng tin đăng
            </span>
            <h1 className="home-room-banner__title">
              Bất động sản <span className="home-room-banner__title-accent">&amp; Xe cộ</span>
            </h1>
            <p className="home-room-banner__tagline">Kết nối giá trị – Khai mở tiềm năng</p>
            <p className="home-room-banner__sub">
              Hàng nghìn tin đăng nhà đất &amp; xe cộ đã xác thực — đăng tin nhanh chóng, dễ dàng.
            </p>
          </div>

          {/* Floating stat cards over the photo */}
          <div className="home-room-banner__floats">
            <div className="home-room-banner__float">
              <strong>12,458+</strong>
              <small>Tin đang đăng</small>
            </div>
            <div className="home-room-banner__float">
              <strong>3,215+</strong>
              <small>Đã giao dịch</small>
            </div>
          </div>
          <div className="home-room-banner__photo">
            {BANNER_IMAGES.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={index === bannerIndex ? 'Bất động sản mua bán và cho thuê' : ''}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 55vw, 480px"
                className={`home-room-banner__image${index === bannerIndex ? ' is-active' : ''}`}
              />
            ))}
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
          {/* Công tắc danh mục cấp cao: Nhà đất | Xe cộ */}
          <div className="mb-3 inline-flex rounded-full bg-surface-subtle p-1">
            {([
              { key: 'property', label: 'Tin bất động sản' },
              { key: 'vehicle', label: 'Tin xe cộ' },
            ] as const).map((v) => (
              <button
                key={v.key}
                type="button"
                aria-pressed={vertical === v.key}
                onClick={() => {
                  setVertical(v.key);
                  setOpenFilter(null);
                }}
                className={
                  'rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ' +
                  (vertical === v.key ? 'bg-primary text-white shadow' : 'text-ink-muted hover:text-ink')
                }
              >
                {v.label}
              </button>
            ))}
          </div>

          {vertical === 'property' && (
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
          )}

          <label className="home-search__keyword">
            <Search size={19} />
            <span>
              <small>Từ khóa</small>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  vertical === 'vehicle'
                    ? 'Nhập hãng, dòng xe cần tìm (VD: Toyota Vios, SH...)'
                    : 'Nhập dự án, tên đường hoặc khu vực cần tìm...'
                }
              />
            </span>
          </label>

          <div className="home-search__bar">
            {vertical === 'property' && (
            <>
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
            </>
            )}

            {vertical === 'vehicle' && (
            <>
            <FilterMenu name="vehicleType" label="Loại xe" value={selectedVehicleType} icon={<Building2 size={18} />} open={openFilter === 'vehicleType'} onToggle={toggleFilter}>
              <label className="home-search__option">
                <input type="radio" name="home-vehicle-type" checked={!vehicleType} onChange={() => { setVehicleType(''); setOpenFilter(null); }} />
                <span>Tất cả loại xe</span>
              </label>
              {Object.entries(VEHICLE_TYPE_LABELS).map(([value, label]) => (
                <label key={value} className="home-search__option">
                  <input type="radio" name="home-vehicle-type" checked={vehicleType === value} onChange={() => { setVehicleType(value); setOpenFilter(null); }} />
                  <span>{label}</span>
                </label>
              ))}
            </FilterMenu>

            <FilterMenu name="vehiclePrice" label="Khoảng giá" value={selectedVehiclePrice} icon={<BadgeDollarSign size={18} />} open={openFilter === 'vehiclePrice'} onToggle={toggleFilter} wide>
              <div className="home-search__price-grid">
                <label className="home-search__option">
                  <input type="radio" name="home-vehicle-price" checked={!vehiclePrice} onChange={() => { setVehiclePrice(''); setOpenFilter(null); }} />
                  <span>Tất cả mức giá</span>
                </label>
                {VEHICLE_PRICE_BRACKETS.map((bracket, index) => (
                  <label key={bracket.label} className="home-search__option">
                    <input type="radio" name="home-vehicle-price" checked={vehiclePrice === String(index)} onChange={() => { setVehiclePrice(String(index)); setOpenFilter(null); }} />
                    <span>{bracket.label}</span>
                  </label>
                ))}
              </div>
            </FilterMenu>
            </>
            )}

            <button type="submit" className="home-search__submit" aria-label="Tìm kiếm">
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
