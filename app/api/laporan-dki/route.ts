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
    
    // Check role access - hanya viewer yang bisa akses
    if (user.role !== 'viewer') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const tahun = searchParams.get('tahun') || '2025'

    const supabase = createAdminClient()
    
    // Query agregasi total Jakarta per bulan
    const { data, error } = await supabase
      .from('absensi')
      .select(`
        bulan,
        hadir_putra,
        hadir_putri,
        kelompok!inner(
          target_putra,
          target_putri
        )
      `)
      .eq('tahun', tahun)
    
    if (error) throw error
    
    // Agregasi manual per bulan
    const monthlyData: { [key: number]: { 
      total_hadir_putra: number, 
      total_hadir_putri: number,
      total_target_putra: number,
      total_target_putri: number
    }} = {}
    
    data.forEach(item => {
      if (!monthlyData[item.bulan]) {
        monthlyData[item.bulan] = {
          total_hadir_putra: 0,
          total_hadir_putri: 0,
          total_target_putra: 0,
          total_target_putri: 0
        }
      }
      
      monthlyData[item.bulan].total_hadir_putra += item.hadir_putra || 0
      monthlyData[item.bulan].total_hadir_putri += item.hadir_putri || 0
      monthlyData[item.bulan].total_target_putra += item.kelompok.target_putra || 0
      monthlyData[item.bulan].total_target_putri += item.kelompok.target_putri || 0
    })
    
    // Format hasil
    const result = []
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    
    for (let bulan = 1; bulan <= 12; bulan++) {
      const monthData = monthlyData[bulan]
      
      if (monthData) {
        const persentase_putra = monthData.total_target_putra > 0 
          ? (monthData.total_hadir_putra / monthData.total_target_putra) * 100 
          : 0
        const persentase_putri = monthData.total_target_putri > 0 
          ? (monthData.total_hadir_putri / monthData.total_target_putri) * 100 
          : 0
          
        result.push({
          bulan,
          nama_bulan: monthNames[bulan - 1],
          persentase_putra: Math.round(persentase_putra * 10) / 10,
          persentase_putri: Math.round(persentase_putri * 10) / 10,
          total_hadir_putra: monthData.total_hadir_putra,
          total_hadir_putri: monthData.total_hadir_putri,
          total_target_putra: monthData.total_target_putra,
          total_target_putri: monthData.total_target_putri
        })
      } else {
        result.push({
          bulan,
          nama_bulan: monthNames[bulan - 1],
          persentase_putra: 0,
          persentase_putri: 0,
          total_hadir_putra: 0,
          total_hadir_putri: 0,
          total_target_putra: 0,
          total_target_putri: 0
        })
      }
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