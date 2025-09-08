import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  return NextResponse.json(
    { error: 'Method GET not allowed. Use POST.' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Hardcoded users for testing
    const users = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        full_name: 'Super Admin',
        role: 'super_admin',
        desa_id: null
      },
      {
        id: 2,
        username: 'koordinator1',
        password: 'admin123',
        full_name: 'Koordinator Kapuk Melati',
        role: 'koordinator_desa',
        desa_id: 1
      },
      {
        id: 3,
        username: 'koordinator2',
        password: 'admin123',
        full_name: 'Koordinator Jelambar',
        role: 'koordinator_desa',
        desa_id: 2
      }
    ]

    const user = users.find(u => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set('user_session', JSON.stringify({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      desa_id: user.desa_id
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        desa_id: user.desa_id
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan server',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
