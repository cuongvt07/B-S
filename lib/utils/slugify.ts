import slugifyLib from 'slugify';

export function slugify(input: string): string {
  return slugifyLib(input, {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
}

export function buildListingSlug(title: string, id: string): string {
  return `${slugify(title)}-${id}`;
}

export function extractIdFromSlug(slugWithId: string): string | null {
  const match = slugWithId.match(/-([a-z0-9]+)$/i);
  return match ? match[1] : null;
}
