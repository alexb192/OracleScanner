import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: unknown }) => {
  // redirects page based on login status
  const session = (req as { auth: { user?: unknown } | null }).auth
  const { nextUrl } = req

  const isLoggedIn = !!session?.user
  const isLoginPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register'
  const isDashboard = nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
