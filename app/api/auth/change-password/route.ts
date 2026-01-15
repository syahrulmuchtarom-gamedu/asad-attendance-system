import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let user
    try {
      user = JSON.parse(sessionCookie)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru harus diisi' }, { status: 400 })
    }

    // Validasi password baru (huruf + angka, min 6 karakter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json({ 
        error: 'Password baru harus minimal 6 karakter dan mengandung huruf serta angka' 
      }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verifikasi password lama
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('password')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Simple password check (dalam production sebaiknya pakai bcrypt)
    if (userData.password !== oldPassword) {
      return NextResponse.json({ error: 'Password lama tidak sesuai' }, { status: 400 })
    }

    // Update password baru
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: newPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update password error:', JSON.stringify({ error: updateError.message, code: updateError.code }))
      return NextResponse.json({ error: 'Gagal mengubah password' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Password berhasil diubah. Silakan login kembali.' 
    })

  } catch (error) {
    console.error('Change password API error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}