export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function listingSchema(listing: {
  id: string;
  title: string;
  description: string;
  images: { url: string }[];
  price: number;
  priceUnit: 'month' | 'total';
  area: number;
  addressLine: string;
  cityName: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    image: listing.images.map((i) => i.url),
    url: listing.url,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.addressLine,
      addressLocality: listing.cityName,
      addressCountry: 'VN',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: listing.area,
      unitCode: 'MTK',
    },
  };
}

export function vehicleSchema(vehicle: {
  type: 'car' | 'motorbike';
  title: string;
  description: string;
  images: { url: string }[];
  price: number;
  brand?: string;
  modelName?: string;
  year?: number;
  mileage?: number;
  fuelTypeLabel?: string;
  transmissionLabel?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': vehicle.type === 'motorbike' ? 'Motorcycle' : 'Car',
    name: vehicle.title,
    description: vehicle.description,
    image: vehicle.images.map((i) => i.url),
    url: vehicle.url,
    ...(vehicle.brand ? { brand: { '@type': 'Brand', name: vehicle.brand } } : {}),
    ...(vehicle.modelName ? { model: vehicle.modelName } : {}),
    ...(vehicle.year ? { vehicleModelDate: String(vehicle.year), productionDate: String(vehicle.year) } : {}),
    ...(vehicle.mileage !== undefined
      ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'KMT' } }
      : {}),
    ...(vehicle.fuelTypeLabel ? { fuelType: vehicle.fuelTypeLabel } : {}),
    ...(vehicle.transmissionLabel ? { vehicleTransmission: vehicle.transmissionLabel } : {}),
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    },
  };
}

/** WebSite + SearchAction — bật ô tìm kiếm sitelinks trên Google. */
export function websiteSchema(site: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/tin-dang?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  image: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    author: { '@type': 'Person', name: article.authorName },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: article.url,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
