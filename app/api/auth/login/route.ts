import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log('Login API called with:', { username, password: '***' })

    if (!username || !password) {
      console.log('Missing username or password')
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    console.log('Querying users table...')

    // Query tabel users
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('is_active', true)
      .single()

    console.log('Query result:', { user: user ? 'found' : 'not found', error })

    if (error || !user) {
      console.log('Login failed - user not found or password incorrect')
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }
    
    console.log('Login successful for user:', user.username)

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
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}