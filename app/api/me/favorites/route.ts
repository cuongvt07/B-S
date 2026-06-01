import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { favoritesStore, listingsStore } from '@/mocks/store';

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });

  const ids = favoritesStore.list(user.id);
  const listings = ids
    .map((id) => listingsStore.get(id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
  return NextResponse.json({ data: listings });
}

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { listingId?: string } | null;
  if (!body?.listingId) return NextResponse.json({ message: 'Thiếu listingId' }, { status: 400 });

  const added = favoritesStore.toggle(user.id, body.listingId);
  return NextResponse.json({ data: { listingId: body.listingId, favorited: added } });
}
