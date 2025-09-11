import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value, description')
      .in('key', ['admin_phone', 'admin_whatsapp'])

    if (error) throw error

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
      console.error('JSON parse error for session:', error)
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Hanya super_admin yang bisa update settings
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { admin_phone, admin_whatsapp } = await request.json()

    if (!admin_phone || !admin_whatsapp) {
      return NextResponse.json({ 
        error: 'Nomor telepon dan WhatsApp harus diisi' 
      }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Helper function untuk update setting
    const updateSetting = async (key: string, value: string) => {
      const { error } = await supabase
        .from('settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
      
      if (error) throw error
    }

    // Update both settings
    await Promise.all([
      updateSetting('admin_phone', admin_phone),
      updateSetting('admin_whatsapp', admin_whatsapp)
    ])

    return NextResponse.json({ 
      message: 'Kontak admin berhasil diupdate' 
    })

  } catch (error: any) {
    console.error('Settings PUT error:', error)
    
    // Check if it's a database table not found error
    if (error.message?.includes('relation "settings" does not exist')) {
      return NextResponse.json({ 
        error: 'Tabel settings belum dibuat. Jalankan SQL schema terlebih dahulu.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Gagal mengupdate kontak admin' 
    }, { status: 500 })
  }
}