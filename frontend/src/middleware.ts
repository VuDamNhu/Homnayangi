import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Các path cần đăng nhập (nhưng loại trừ /admin/login)
const PROTECTED_PATHS = ['/dashboard', '/profile'];
// Các path dành cho admin (trừ trang login của admin)
const PROTECTED_ADMIN_PATHS = ['/admin'];
const GUEST_PATHS = ['/login', '/register', '/admin/login'];

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/_next')) return NextResponse.next();

  const response = intlMiddleware(req);

  const pathname = req.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, '') || '/';
  const hasSession = req.cookies.has('access_token') || req.cookies.has('refresh_token');

  // Chặn các route user cần đăng nhập → redirect về /login
  if (PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p)) && !hasSession) {
    const url = new URL(`/${routing.defaultLocale}/login`, req.url);
    url.searchParams.set('redirect', pathWithoutLocale);
    return NextResponse.redirect(url);
  }

  // Chặn các route admin (trừ /admin/login) → redirect về /admin/login
  const isAdminLoginPage = pathWithoutLocale === '/admin/login';
  if (
    PROTECTED_ADMIN_PATHS.some((p) => pathWithoutLocale.startsWith(p)) &&
    !isAdminLoginPage &&
    !hasSession
  ) {
    const url = new URL(`/${routing.defaultLocale}/admin/login`, req.url);
    url.searchParams.set('redirect', pathWithoutLocale);
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập mà vào trang guest → redirect về dashboard
  if (GUEST_PATHS.includes(pathWithoutLocale) && hasSession) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/dashboard`, req.url));
  }

  return response;
}

export const config = { matcher: ['/((?!_next|favicon.ico|images|api).*)'] };
