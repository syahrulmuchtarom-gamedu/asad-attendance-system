import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Get user session from cookie
    const sessionCookie = request.cookies.get('user_session')?.value
    let user = null
    
    if (sessionCookie) {
      try {
        user = JSON.parse(sessionCookie)
      } catch (e) {
        // Invalid session cookie
      }
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/']
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated and trying to access auth pages
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }

    // Role-based route protection
    if (user) {
      const pathname = request.nextUrl.pathname
      const dashboardUrl = new URL('/dashboard', request.url)
      
      if (pathname.startsWith('/dashboard/super-admin') && user.role !== 'super_admin') {
        return NextResponse.redirect(dashboardUrl)
      }

      if (pathname.startsWith('/dashboard/koordinator-desa') && user.role !== 'koordinator_desa') {
        return NextResponse.redirect(dashboardUrl)
      }

      if (pathname.startsWith('/dashboard/koordinator-daerah') && user.role !== 'koordinator_daerah') {
        return NextResponse.redirect(dashboardUrl)
      }

      if (pathname.startsWith('/dashboard/viewer') && user.role !== 'viewer') {
        return NextResponse.redirect(dashboardUrl)
      }

      if (pathname.startsWith('/dashboard/astrida') && user.role !== 'astrida') {
        return NextResponse.redirect(dashboardUrl)
      }
    }

    return response
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
