import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase.proxy'

const NON_AUTH_ROUTES = [
  /^\/login(\/.*)?$/,
  /^\/signup(\/.*)?$/,
  /^\/forgot-password(\/.*)?$/,
  /^\/reset-password(\/.*)?$/,
]

export async function proxy(request: NextRequest) {
  // Refresh the auth token (Crucial for SSR)
  const { response, user } = await updateSession(request)

  const url = request.nextUrl.clone()

  // user logged in
  if (user && NON_AUTH_ROUTES.some((r) => r.test(url.pathname))) {
    return Response.redirect(new URL('/', request.url))
  }

  // // user NOT logged in
  // if (!user && url.pathname.startsWith('/')) {
  //   return Response.redirect(new URL('/login', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
