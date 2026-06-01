import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'bds_session';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/dang-nhap';
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/tai-khoan/:path*'],
};
