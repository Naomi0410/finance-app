import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, secureCookie: process.env.VERCEL_ENV !== 'local' });
  const isLoggedIn = !!token;

  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRegisterPage = request.nextUrl.pathname === '/register';
  const isDemoRoute = request.nextUrl.pathname.startsWith('/demo');


  // If not logged in and trying to access a protected page (not login/register)
  if (!isLoggedIn && !isLoginPage && !isRegisterPage && !isDemoRoute) {
    console.log("Redirecting to /login due to not logged in.");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login/register page
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    console.log("Redirecting to / due to being logged in.");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)'],
};