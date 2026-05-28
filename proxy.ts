import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth

  if (!session) {
    // unauthenticated: only /login is allowed
    if (nextUrl.pathname === '/login') return NextResponse.next()
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (!session.user.admin) {
    // non-admin: only /scanner is allowed
    if (nextUrl.pathname === '/scanner') return NextResponse.next()
    return NextResponse.redirect(new URL('/scanner', nextUrl))
  }

  // admin: unrestricted
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
