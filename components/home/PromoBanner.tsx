'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
} from 'lucide-react';
import type { Listing } from '@/types';
import { formatArea, formatPrice } from '@/lib/utils/format';
import { formatLocation } from '@/mocks/data/cities';

interface FeaturedProperty {
  id: string;
  title: string;
  address: string;
  description: string;
  image: string;
  price: number;
  priceUnit: 'month' | 'total';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  transactionType: 'rent' | 'sale';
  href: string;
}

const FALLBACK_PROPERTIES: FeaturedProperty[] = [
  {
    id: 'featured-villa',
    title: 'Biệt thự hiện đại với không gian sống tinh tế',
    address: 'Trung tâm thành phố',
    description:
      'Không gian sống cao cấp, thiết kế hài hòa và đầy đủ tiện nghi cho gia đình hiện đại.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    price: 8_500_000_000,
    priceUnit: 'total',
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    transactionType: 'sale',
    href: '/tin-dang',
  },
  {
    id: 'featured-apartment',
    title: 'Căn hộ cao cấp, nội thất hoàn thiện',
    address: 'Khu đô thị hiện đại',
    description:
      'Căn hộ nhiều ánh sáng tự nhiên, bố trí tối ưu và kết nối thuận tiện đến các tiện ích.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    price: 18_000_000,
    priceUnit: 'month',
    bedrooms: 2,
    bathrooms: 2,
    area: 92,
    transactionType: 'rent',
    href: '/tin-dang',
  },
];

function fromListing(listing: Listing): FeaturedProperty | null {
  const image = listing.images[0]?.url;
  if (!image) return null;
  const location = formatLocation(
    listing.cityCode,
    listing.districtCode,
    listing.wardName
  );
  return {
    id: listing.id,
    title: listing.title,
    address: [listing.addressLine, location].filter(Boolean).join(', '),
    description: listing.description,
    image,
    price: listing.price,
    priceUnit: listing.priceUnit,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    area: listing.area,
    transactionType: listing.transactionType,
    href: `/tin-dang/${listing.slug}`,
  };
}

export function PromoBanner({ listings = [] }: { listings?: Listing[] }) {
  const properties = useMemo(() => {
    const real = listings
      .map(fromListing)
      .filter((item): item is FeaturedProperty => item !== null)
      .slice(0, 5);
    return real.length ? real : FALLBACK_PROPERTIES;
  }, [listings]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeIndex = idx % properties.length;
  const property = properties[activeIndex];

  const goTo = useCallback(
    (next: number) => setIdx((next + properties.length) % properties.length),
    [properties.length]
  );

  useEffect(() => {
    if (paused || properties.length < 2) return;
    const timer = window.setInterval(() => setIdx((current) => (current + 1) % properties.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, properties.length]);

  return (
    <section className="container-app py-8">
      <div
        className="featured-property"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="featured-property__image">
          <Image
            key={property.image}
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 52vw"
            className="object-cover"
          />
          <div className="featured-property__badges">
            <span>NỔI BẬT</span>
            <span>{property.transactionType === 'rent' ? 'CHO THUÊ' : 'MUA BÁN'}</span>
          </div>
        </div>

        <div className="featured-property__content">
          <p className="featured-property__eyebrow">BẤT ĐỘNG SẢN NỔI BẬT</p>
          <h2 className="uppercase">Không gian đáng sống</h2>
          <h3>{property.title}</h3>
          <p className="featured-property__address">
            <MapPin size={14} /> {property.address}
          </p>
          <p className="featured-property__description">{property.description}</p>

          <div className="featured-property__facts">
            {property.bedrooms ? <span><BedDouble size={15} /> {property.bedrooms} PN</span> : null}
            {property.bathrooms ? <span><Bath size={15} /> {property.bathrooms} WC</span> : null}
            <span><Maximize2 size={15} /> {formatArea(property.area)}</span>
          </div>

          <div className="featured-property__footer">
            <strong>{formatPrice(property.price, property.priceUnit)}</strong>
            <Link href={property.href} className="unstyled">
              Xem chi tiết <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {properties.length > 1 ? (
          <>
            <div className="featured-property__dots" aria-label="Chọn bất động sản nổi bật">
              {properties.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Bất động sản ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
            <div className="featured-property__navigation">
              <button type="button" aria-label="Tin trước" onClick={() => goTo(activeIndex - 1)}>
                <ChevronLeft size={17} />
              </button>
              <button type="button" aria-label="Tin sau" onClick={() => goTo(activeIndex + 1)}>
                <ChevronRight size={17} />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
