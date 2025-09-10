import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const { searchParams } = new URL(request.url)
    const bulan = searchParams.get('bulan')
    const tahun = searchParams.get('tahun')

    const supabase = createAdminClient()
    
    let query = supabase
      .from('absensi')
      .select(`
        *,
        kelompok!inner(
          id,
          nama_kelompok,
          desa_id,
          target_putra,
          target_putri,
          desa!inner(
            id,
            nama_desa
          )
        )
      `)
    
    // Filter berdasarkan role dan desa
    if (user.role === 'koordinator_desa' && user.desa_id) {
      query = query.eq('kelompok.desa_id', user.desa_id)
    }
    // Super admin, astrida, dan role lain melihat semua data (tidak ada filter)
    
    if (bulan) query = query.eq('bulan', bulan)
    if (tahun) query = query.eq('tahun', tahun)
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch absensi data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Redirect POST to PUT for UPSERT functionality
  return PUT(request)
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const data = await request.json()
    const supabase = createAdminClient()

    // Validasi: koordinator desa hanya bisa update untuk kelompok di desanya
    if (user.role === 'koordinator_desa') {
      const { data: kelompok } = await supabase
        .from('kelompok')
        .select('desa_id')
        .eq('id', data.kelompok_id)
        .single()
      
      if (!kelompok || kelompok.desa_id !== user.desa_id) {
        return NextResponse.json({ 
          error: 'Anda tidak memiliki akses untuk kelompok ini' 
        }, { status: 403 })
      }
    }

    // Use UPSERT (insert or update)
    const { data: upsertedAbsensi, error: upsertError } = await supabase
      .from('absensi')
      .upsert({
        kelompok_id: data.kelompok_id,
        bulan: data.bulan,
        tahun: data.tahun,
        hadir_putra: data.hadir_putra,
        hadir_putri: data.hadir_putri,
        input_by: user.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'kelompok_id,bulan,tahun'
      })
      .select()
      .single()

    if (upsertError) {
      console.error('Upsert absensi error:', upsertError)
      throw upsertError
    }

    return NextResponse.json({ 
      message: 'Data absensi berhasil disimpan',
      data: upsertedAbsensi 
    })
  } catch (error) {
    console.error('PUT API Error:', error)
    return NextResponse.json({ 
      error: 'Gagal mengupdate data' 
    }, { status: 500 })
  }
}