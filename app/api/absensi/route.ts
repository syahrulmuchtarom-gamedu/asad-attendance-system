import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bulan = searchParams.get('bulan')
    const tahun = searchParams.get('tahun')

    const supabase = createAdminClient()
    
    let query = supabase.from('absensi').select('*')
    
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
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const data = await request.json()
    const supabase = createAdminClient()

    // Check if data already exists
    const { data: existing } = await supabase
      .from('absensi')
      .select('*')
      .eq('kelompok_id', data.kelompok_id)
      .eq('bulan', data.bulan)
      .eq('tahun', data.tahun)
      .single()

    if (existing) {
      return NextResponse.json({ 
        error: 'Data sudah ada untuk kelompok ini pada bulan tersebut' 
      }, { status: 400 })
    }

    // Insert new data
    const { data: newAbsensi, error } = await supabase
      .from('absensi')
      .insert({
        kelompok_id: data.kelompok_id,
        bulan: data.bulan,
        tahun: data.tahun,
        hadir_putra: data.hadir_putra,
        hadir_putri: data.hadir_putri,
        target_putra: data.target_putra,
        target_putri: data.target_putri,
        input_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Data absensi berhasil disimpan',
      data: newAbsensi 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Gagal menyimpan data' 
    }, { status: 500 })
  }
}