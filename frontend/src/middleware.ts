import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ['/dashboard', '/profile', '/admin'];
const GUEST_PATHS = ['/login', '/register'];

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/_next')) return NextResponse.next();

  const response = intlMiddleware(req);

  const pathname = req.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, '') || '/';
  const hasSession = req.cookies.has('access_token') || req.cookies.has('refresh_token');

  if (PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p)) && !hasSession) {
    const url = new URL(`/${routing.defaultLocale}/login`, req.url);
    url.searchParams.set('redirect', pathWithoutLocale);
    return NextResponse.redirect(url);
  }

  if (GUEST_PATHS.includes(pathWithoutLocale) && hasSession) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/dashboard`, req.url));
  }

  return response;
}

export const config = { matcher: ['/((?!_next|favicon.ico|images|api).*)'] };
