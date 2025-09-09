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
    
    // Query untuk mendapatkan data absensi dengan join ke kelompok dan desa
    let query = supabase
      .from('absensi')
      .select(`
        hadir_putra,
        hadir_putri,
        kelompok!inner(
          target_putra,
          target_putri,
          desa!inner(
            nama_desa
          )
        )
      `)
    
    // Filter berdasarkan role dan desa
    if (user.role === 'koordinator_desa' && user.desa_id) {
      query = query.eq('kelompok.desa_id', user.desa_id)
    }
    
    if (bulan) query = query.eq('bulan', bulan)
    if (tahun) query = query.eq('tahun', tahun)
    
    const { data, error } = await query
    
    if (error) {
      console.error('Laporan fetch error:', error)
      throw error
    }
    
    // Aggregate data per desa
    const desaMap = new Map()
    
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        const desaName = item.kelompok.desa.nama_desa
        const targetPutra = item.kelompok.target_putra || 0
        const targetPutri = item.kelompok.target_putri || 0
        const hadirPutra = item.hadir_putra || 0
        const hadirPutri = item.hadir_putri || 0
        
        if (!desaMap.has(desaName)) {
          desaMap.set(desaName, {
            desa: desaName,
            target: 0,
            hadir: 0,
            kelompok_count: 0
          })
        }
        
        const desaData = desaMap.get(desaName)
        desaData.target += targetPutra + targetPutri
        desaData.hadir += hadirPutra + hadirPutri
        desaData.kelompok_count += 1
      })
    }
    
    const aggregatedData = Array.from(desaMap.values())
    
    return NextResponse.json({ data: aggregatedData })
  } catch (error) {
    console.error('Laporan API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch laporan data' },
      { status: 500 }
    )
  }
}