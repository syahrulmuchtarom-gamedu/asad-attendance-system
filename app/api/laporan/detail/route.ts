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
    
    // Alternatif: Query step by step untuk debugging
    // 1. Cari desa_id berdasarkan nama desa
    const { data: desaData, error: desaError } = await supabase
      .from('desa')
      .select('id')
      .eq('nama_desa', desa)
      .single()
    
    if (desaError || !desaData) {
      console.error('Desa not found:', desaError)
      return NextResponse.json({ error: 'Desa not found' }, { status: 404 })
    }
    
    // 2. Cari kelompok berdasarkan desa_id
    const { data: kelompokData, error: kelompokError } = await supabase
      .from('kelompok')
      .select('id, nama_kelompok, target_putra, target_putri')
      .eq('desa_id', desaData.id)
    
    if (kelompokError) {
      console.error('Kelompok fetch error:', kelompokError)
      return NextResponse.json({ error: 'Failed to fetch kelompok' }, { status: 500 })
    }
    
    // 3. Cari data absensi untuk kelompok-kelompok tersebut
    const kelompokIds = kelompokData?.map(k => k.id) || []
    
    const { data, error } = await supabase
      .from('absensi')
      .select('kelompok_id, hadir_putra, hadir_putri')
      .in('kelompok_id', kelompokIds)
      .eq('bulan', parseInt(bulan))
      .eq('tahun', parseInt(tahun))
    
    console.log('Debug info:', {
      desa,
      desaId: desaData.id,
      kelompokCount: kelompokData?.length,
      kelompokIds,
      absensiCount: data?.length
    })
    
    if (error) {
      console.error('Detail laporan fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // 4. Gabungkan data kelompok dengan data absensi
    const detailData = kelompokData?.map((kelompok: any) => {
      const absensi = data?.find((a: any) => a.kelompok_id === kelompok.id)
      return {
        kelompok: kelompok.nama_kelompok,
        target_putra: kelompok.target_putra || 0,
        hadir_putra: absensi?.hadir_putra || 0,
        target_putri: kelompok.target_putri || 0,
        hadir_putri: absensi?.hadir_putri || 0,
        total_target: (kelompok.target_putra || 0) + (kelompok.target_putri || 0),
        total_hadir: (absensi?.hadir_putra || 0) + (absensi?.hadir_putri || 0)
      }
    }) || []
    
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