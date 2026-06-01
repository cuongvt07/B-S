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
