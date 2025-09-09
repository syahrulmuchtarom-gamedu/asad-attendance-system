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

    const { searchParams } = new URL(request.url)
    const desa = searchParams.get('desa')
    const bulan = searchParams.get('bulan')
    const tahun = searchParams.get('tahun')

    if (!desa || !bulan || !tahun) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    // Query untuk mendapatkan detail kelompok per desa
    const { data, error } = await supabase
      .from('absensi')
      .select(`
        hadir_putra,
        hadir_putri,
        kelompok!inner(
          nama_kelompok,
          target_putra,
          target_putri,
          desa!inner(
            nama_desa
          )
        )
      `)
      .eq('kelompok.desa.nama_desa', desa)
      .eq('bulan', bulan)
      .eq('tahun', tahun)
      .order('kelompok.nama_kelompok')
    
    if (error) {
      console.error('Detail laporan fetch error:', error)
      throw error
    }
    
    // Format data untuk response
    const detailData = data?.map((item: any) => ({
      kelompok: item.kelompok.nama_kelompok,
      target_putra: item.kelompok.target_putra || 0,
      hadir_putra: item.hadir_putra || 0,
      target_putri: item.kelompok.target_putri || 0,
      hadir_putri: item.hadir_putri || 0,
      total_target: (item.kelompok.target_putra || 0) + (item.kelompok.target_putri || 0),
      total_hadir: (item.hadir_putra || 0) + (item.hadir_putri || 0)
    })) || []
    
    return NextResponse.json({ 
      data: detailData,
      desa: desa,
      periode: `${bulan}/${tahun}`
    })
  } catch (error) {
    console.error('Detail laporan API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch detail laporan data' },
      { status: 500 }
    )
  }
}