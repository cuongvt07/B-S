import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { listingsStore } from '@/mocks/store';
import type { Listing } from '@/types';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });

  const existing = listingsStore.get(params.id);
  if (!existing) return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 });
  if (existing.ownerId !== user.id)
    return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });

  const patch = (await req.json()) as Partial<Listing>;
  const updated: Listing = {
    ...existing,
    ...patch,
    id: existing.id,
    ownerId: existing.ownerId,
    updatedAt: new Date().toISOString(),
  };
  listingsStore.upsert(updated);
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });

  const existing = listingsStore.get(params.id);
  if (!existing) return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 });
  if (existing.ownerId !== user.id)
    return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });

  listingsStore.delete(params.id);
  return new NextResponse(null, { status: 204 });
}
