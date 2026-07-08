import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, '') || '/';
  const isPublic = pathnameWithoutLocale === '/login' || pathnameWithoutLocale.startsWith('/login/');
  const isAuth = request.cookies.get('alshisr_auth')?.value === '1';

  const localeMatch = pathname.match(/^\/(ar|en)/);
  const locale = localeMatch?.[1] || routing.defaultLocale;

  if (!isPublic && !isAuth) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && isAuth && pathnameWithoutLocale === '/login') {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!_next/static|_next/image|favicon.ico|logo_alshisr.png|favicons|api).*)'],
};
