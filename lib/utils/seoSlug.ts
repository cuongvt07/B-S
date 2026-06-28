import type { ListingFilter } from '@/types';
import { cities } from '@/mocks/data/cities';

const TRANSACTION_MAP: Record<string, 'rent' | 'sale'> = {
  'cho-thue': 'rent',
  'ban': 'sale',
  'mua-ban': 'sale',
};

const PROPERTY_MAP: Record<string, ListingFilter['propertyType']> = {
  'can-ho': 'apartment',
  'chung-cu': 'apartment',
  'phong-tro': 'room',
  'nha-nguyen-can': 'house',
  'nha-rieng': 'house',
  'nha-dat': 'house',
  'van-phong': 'office',
  'mat-bang': 'office',
  'o-ghep': 'shared',
  'dat-rung': 'forest',
  'dat': 'land',
  'kho-xuong': 'warehouse',
  'kho-bai': 'warehouse',
  'quan-nhau': 'bar',
  'karaoke': 'karaoke',
  'quan-cafe': 'cafe',
  'cafe': 'cafe',
};

// Build CITY_MAP from cities data (covers all 63 provinces automatically)
const CITY_MAP: Record<string, string> = {
  tphcm: 'hcm',
  'ho-chi-minh': 'hcm',
  hcm: 'hcm',
  ...Object.fromEntries(cities.map((c) => [c.slug, c.code])),
};

// District map: "city-slug:district-slug" → districtCode, also bare district-slug fallback
const DISTRICT_MAP_BY_CITY: Record<string, Record<string, string>> = Object.fromEntries(
  cities.map((c) => [
    c.code,
    Object.fromEntries(c.districts.map((d) => [d.slug, d.code])),
  ])
);

export interface ParsedSeoSlug {
  transactionType?: ListingFilter['transactionType'];
  propertyType?: ListingFilter['propertyType'];
  cityCode?: string;
  districtCode?: string;
}

export function parseSeoSlug(slug: string): ParsedSeoSlug {
  const result: ParsedSeoSlug = {};
  const lower = slug.toLowerCase();

  for (const key of Object.keys(TRANSACTION_MAP)) {
    if (lower.startsWith(key)) {
      result.transactionType = TRANSACTION_MAP[key];
      break;
    }
  }

  for (const key of Object.keys(PROPERTY_MAP)) {
    if (lower.includes(key)) {
      result.propertyType = PROPERTY_MAP[key];
      break;
    }
  }

  const sortedCities = Object.keys(CITY_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedCities) {
    if (lower.endsWith('-' + key) || lower === key || lower.endsWith(key)) {
      result.cityCode = CITY_MAP[key];
      break;
    }
  }

  if (result.cityCode) {
    const cityDistricts = DISTRICT_MAP_BY_CITY[result.cityCode] ?? {};
    const sortedDistricts = Object.keys(cityDistricts).sort((a, b) => b.length - a.length);
    for (const dSlug of sortedDistricts) {
      if (lower.includes('-' + dSlug + '-') || lower.endsWith('-' + dSlug)) {
        result.districtCode = cityDistricts[dSlug];
        break;
      }
    }
  }

  return result;
}

export function isSeoLandingSlug(slug: string): boolean {
  const parsed = parseSeoSlug(slug);
  return Boolean(parsed.transactionType || parsed.propertyType || parsed.cityCode);
}
