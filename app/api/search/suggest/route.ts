import { NextResponse, type NextRequest } from 'next/server';
import { cities } from '@/mocks/data/cities';
import { listingsStore } from '@/mocks/store';

export interface SuggestLocation {
  type: 'city' | 'district';
  cityCode: string;
  districtCode?: string;
  label: string;
}

export interface SuggestListing {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceUnit: 'month' | 'total';
  cover?: string;
  cityCode: string;
}

export interface SuggestResponse {
  data: {
    locations: SuggestLocation[];
    listings: SuggestListing[];
  };
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q') ?? '';
  const q = normalize(raw.trim());

  if (q.length < 1) {
    return NextResponse.json<SuggestResponse>({ data: { locations: [], listings: [] } });
  }

  const locations: SuggestLocation[] = [];
  for (const c of cities) {
    const nName = normalize(c.name);
    if (nName.includes(q) || c.slug.includes(q)) {
      locations.push({ type: 'city', cityCode: c.code, label: c.name });
    }
    for (const d of c.districts) {
      if (locations.length >= 8) break;
      const nDName = normalize(d.name);
      if (nDName.includes(q) || d.slug.includes(q)) {
        locations.push({
          type: 'district',
          cityCode: c.code,
          districtCode: d.code,
          label: `${d.name}, ${c.name}`,
        });
      }
    }
    if (locations.length >= 8) break;
  }

  const listings: SuggestListing[] = listingsStore
    .all()
    .filter((l) => {
      const hay = normalize(`${l.title} ${l.addressLine}`);
      return hay.includes(q);
    })
    .slice(0, 5)
    .map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      price: l.price,
      priceUnit: l.priceUnit,
      cover: l.images[0]?.url,
      cityCode: l.cityCode,
    }));

  return NextResponse.json<SuggestResponse>({
    data: { locations: locations.slice(0, 8), listings },
  });
}
