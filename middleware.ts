import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/']
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

    // If user is not authenticated and trying to access protected route
    if (!session && !isPublicRoute) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated and trying to access auth pages
    if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }

    // Get user profile for role-based access
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, desa_id')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        // Role-based route protection
        const pathname = request.nextUrl.pathname

        const dashboardUrl = new URL('/dashboard', request.url)
        
        if (pathname.startsWith('/dashboard/super-admin') && profile.role !== 'super_admin') {
          return NextResponse.redirect(dashboardUrl)
        }

        if (pathname.startsWith('/dashboard/koordinator-desa') && profile.role !== 'koordinator_desa') {
          return NextResponse.redirect(dashboardUrl)
        }

        if (pathname.startsWith('/dashboard/koordinator-daerah') && profile.role !== 'koordinator_daerah') {
          return NextResponse.redirect(dashboardUrl)
        }

        if (pathname.startsWith('/dashboard/viewer') && profile.role !== 'viewer') {
          return NextResponse.redirect(dashboardUrl)
        }
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}