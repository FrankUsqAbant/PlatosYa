// ==========================================================================
// PlatoYa - Middleware de protección de rutas
// Redirige según autenticación y rol del usuario
// ==========================================================================

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAuthPage = nextUrl.pathname.startsWith('/auth');
  const isKitchenPage = nextUrl.pathname.startsWith('/kitchen');
  const isProtectedPage = ['/menu', '/checkout', '/orders'].some(
    (p) => nextUrl.pathname.startsWith(p)
  );

  // Si está en página de auth pero ya inició sesión, redirigir
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(
      new URL(role === 'cocinero' ? '/kitchen' : '/menu', nextUrl)
    );
  }

  // Páginas protegidas requieren autenticación
  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Cocina requiere autenticación
  if (isKitchenPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Cocina requiere rol de cocinero
  if (isKitchenPage && role !== 'cocinero') {
    return NextResponse.redirect(new URL('/menu', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/menu/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/kitchen/:path*',
    '/auth/:path*',
  ],
};
