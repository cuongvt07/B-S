import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/mocks/session';

export async function POST() {
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
