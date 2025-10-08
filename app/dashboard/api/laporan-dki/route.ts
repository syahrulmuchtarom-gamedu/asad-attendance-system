import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    
    // Check role access - viewer dan super_admin yang bisa akses
    if (user.role !== 'viewer' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const tahun = searchParams.get('tahun') || '2025'

    const supabase = createAdminClient()
    
    // Get total target dari SEMUA kelompok (tidak tergantung ada absensi atau tidak)
    const { data: allKelompok, error: kelompokError } = await supabase
      .from('kelompok')
      .select('target_putra, target_putri')
    
    if (kelompokError) throw kelompokError
    
    const totalTargetPutra = allKelompok.reduce((sum, k) => sum + (k.target_putra || 0), 0)
    const totalTargetPutri = allKelompok.reduce((sum, k) => sum + (k.target_putri || 0), 0)
    
    // Query data absensi per bulan
    const { data, error } = await supabase
      .from('absensi')
      .select('bulan, hadir_putra, hadir_putri')
      .eq('tahun', tahun)
    
    if (error) throw error
    
    // Agregasi manual per bulan
    const monthlyData: { [key: number]: { 
      total_hadir_putra: number, 
      total_hadir_putri: number
    }} = {}
    
    data.forEach((item: any) => {
      if (!monthlyData[item.bulan]) {
        monthlyData[item.bulan] = {
          total_hadir_putra: 0,
          total_hadir_putri: 0
        }
      }
      
      monthlyData[item.bulan].total_hadir_putra += item.hadir_putra || 0
      monthlyData[item.bulan].total_hadir_putri += item.hadir_putri || 0
    })
    
    // Format hasil
    const result = []
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    
    for (let bulan = 1; bulan <= 12; bulan++) {
      const monthData = monthlyData[bulan]
      
      const hadirPutra = monthData?.total_hadir_putra || 0
      const hadirPutri = monthData?.total_hadir_putri || 0
      
      const persentase_putra = totalTargetPutra > 0 
        ? (hadirPutra / totalTargetPutra) * 100 
        : 0
      const persentase_putri = totalTargetPutri > 0 
        ? (hadirPutri / totalTargetPutri) * 100 
        : 0
        
      result.push({
        bulan,
        nama_bulan: monthNames[bulan - 1],
        persentase_putra: Math.round(persentase_putra * 10) / 10,
        persentase_putri: Math.round(persentase_putri * 10) / 10,
        total_hadir_putra: hadirPutra,
        total_hadir_putri: hadirPutri,
        total_target_putra: totalTargetPutra,
        total_target_putri: totalTargetPutri
      })
    }
    
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Laporan DKI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch laporan DKI data' },
      { status: 500 }
    )
  }
}