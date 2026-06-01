import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { listingsStore } from '@/mocks/store';
import { buildListingSlug } from '@/lib/utils/slugify';
import type { Listing } from '@/types';

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });
  return NextResponse.json({ data: listingsStore.ofOwner(user.id) });
}

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });

  const body = (await req.json()) as Partial<Listing>;
  if (!body.title || !body.description || !body.price || !body.area) {
    return NextResponse.json({ message: 'Thiếu trường bắt buộc' }, { status: 400 });
  }

  const id = String(Date.now());
  const now = new Date().toISOString();
  const newListing: Listing = {
    id,
    slug: buildListingSlug(body.title, id),
    title: body.title,
    description: body.description,
    price: body.price,
    priceUnit: body.priceUnit ?? 'month',
    area: body.area,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    direction: body.direction,
    furnish: body.furnish,
    transactionType: body.transactionType ?? 'rent',
    propertyType: body.propertyType ?? 'apartment',
    categoryId: body.categoryId ?? 'c-apt-rent',
    cityCode: body.cityCode ?? 'hcm',
    districtCode: body.districtCode ?? 'q1',
    wardName: body.wardName,
    addressLine: body.addressLine ?? '',
    images: body.images ?? [],
    amenities: body.amenities ?? [],
    tags: body.tags ?? [],
    vipTier: 'normal',
    status: 'active',
    contact: {
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    },
    ownerId: user.id,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  };
  listingsStore.upsert(newListing);
  return NextResponse.json({ data: newListing }, { status: 201 });
}
