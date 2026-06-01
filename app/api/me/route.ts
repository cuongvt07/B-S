import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { users } from '@/mocks/data/users';

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });
  return NextResponse.json({ data: user });
}

export async function PUT(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    phone?: string;
    avatarUrl?: string;
  } | null;
  if (!body) return NextResponse.json({ message: 'Thiếu dữ liệu' }, { status: 400 });

  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });

  if (typeof body.name === 'string' && body.name.trim()) users[idx].name = body.name.trim();
  if (typeof body.phone === 'string' && body.phone.trim()) users[idx].phone = body.phone.trim();
  if (typeof body.avatarUrl === 'string')
    users[idx].avatarUrl = body.avatarUrl.trim() || undefined;

  return NextResponse.json({ data: users[idx] });
}
