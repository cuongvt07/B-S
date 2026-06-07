import type { Listing } from '@/types';

/**
 * Approximate city center coordinates [lng, lat] for major Vietnamese cities.
 * Used to generate fake marker positions for listings that lack real lat/lng,
 * so map demos look realistic without polluting the seed data.
 */
const CITY_CENTERS: Record<string, [number, number]> = {
  hcm: [106.7009, 10.7769],
  hn: [105.8542, 21.0285],
  dnang: [108.2022, 16.0544],
  hp: [106.6881, 20.8449],
  ct: [105.7469, 10.0452],
  bd: [106.6519, 10.9804],
  dn: [106.8424, 10.9577],
  brvt: [107.0843, 10.346],
  // Tier 2 fallback approximate region centers
  qninh: [107.2925, 20.9536],
  kh: [109.1947, 12.2388],
  ldong: [108.4583, 11.9404],
  na: [105.6814, 18.6796],
  tho: [105.7851, 19.808],
  tth: [107.59, 16.4637],
  bn: [106.0763, 21.1861],
  hy: [106.0511, 20.6464],
  vp: [105.5996, 21.3609],
  hd: [106.3146, 20.9396],
  bg: [106.1947, 21.273],
  qnam: [108.0191, 15.5394],
  qng: [108.8001, 15.1213],
  52: [109.219, 13.7765],
  py: [109.0928, 13.0882],
  nt: [108.984, 11.5645],
  bt: [108.1022, 10.9333],
  gl: [108.0093, 13.9833],
  dl: [108.0376, 12.6667],
  dnong: [107.6098, 12.0042],
  kt: [108.0073, 14.3497],
  la: [106.4106, 10.5435],
  tg: [106.3404, 10.4493],
  btre: [106.3756, 10.2415],
  vl: [105.9722, 10.2536],
  tv: [106.3346, 9.9342],
  ag: [105.4198, 10.5216],
  kg: [105.0807, 10.0125],
  cm: [105.1524, 9.1768],
  st: [105.974, 9.6022],
  bl: [105.7244, 9.2941],
  hau: [105.7686, 9.7833],
  dt: [105.6356, 10.5333],
  bp: [106.9133, 11.7512],
  tn: [106.1106, 11.31],
  nd: [106.1683, 20.4341],
  hnam: [105.9192, 20.5835],
  nb: [105.9748, 20.2506],
  th: [106.3367, 20.4406],
};

const VN_CENTER: [number, number] = [108.2772, 14.0583];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Deterministic pseudo-random offset for a listing id.
 * Same listing always renders at the same fake spot.
 */
function offsetFromId(id: string): [number, number] {
  const h = hashStr(id);
  const lng = (((h >>> 0) % 1000) / 1000 - 0.5) * 0.08; // ±0.04°  ~4km
  const lat = (((h >>> 8) % 1000) / 1000 - 0.5) * 0.06; // ±0.03°
  return [lng, lat];
}

export function getListingLngLat(listing: Listing): [number, number] {
  if (typeof listing.lng === 'number' && typeof listing.lat === 'number') {
    return [listing.lng, listing.lat];
  }
  const center = CITY_CENTERS[listing.cityCode] ?? VN_CENTER;
  const [dx, dy] = offsetFromId(listing.id);
  return [center[0] + dx, center[1] + dy];
}

export function getCityCenter(cityCode?: string): [number, number] {
  if (!cityCode) return VN_CENTER;
  return CITY_CENTERS[cityCode] ?? VN_CENTER;
}

export { VN_CENTER };
