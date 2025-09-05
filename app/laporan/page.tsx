import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AbsensiTable } from '@/components/tables/absensi-table'
import { AbsensiSummary } from '@/types'

interface LaporanPageProps {
  searchParams: {
    bulan?: string
    tahun?: string
  }
}

export default async function LaporanPage({ searchParams }: LaporanPageProps) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Check permissions
  if (!['super_admin', 'koordinator_daerah', 'viewer'].includes(profile.role)) {
    redirect('/dashboard')
  }

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  const bulan = searchParams.bulan ? parseInt(searchParams.bulan) : currentMonth
  const tahun = searchParams.tahun ? parseInt(searchParams.tahun) : currentYear

  // Get absensi summary data
  const { data: absensiData } = await supabase
    .from('absensi')
    .select(`
      hadir_putra,
      hadir_putri,
      kelompok:kelompok_id (
        target_putra,
        target_putri,
        desa:desa_id (
          id,
          nama_desa
        )
      )
    `)
    .eq('bulan', bulan)
    .eq('tahun', tahun)

  // Get all desa for complete summary
  const { data: allDesa } = await supabase
    .from('desa')
    .select('*')
    .order('nama_desa')

  // Process data into summary format
  const summaryData: AbsensiSummary[] = []

  if (allDesa) {
    for (const desa of allDesa) {
      // Get kelompok count for this desa
      const { count: kelompokCount } = await supabase
        .from('kelompok')
        .select('*', { count: 'exact', head: true })
        .eq('desa_id', desa.id)

      // Filter absensi data for this desa
      const desaAbsensi = absensiData?.filter(
        (item) => item.kelompok?.desa?.id === desa.id
      ) || []

      // Calculate totals
      let totalTargetPutra = 0
      let totalTargetPutri = 0
      let totalHadirPutra = 0
      let totalHadirPutri = 0

      // Get all kelompok targets for this desa
      const { data: kelompokTargets } = await supabase
        .from('kelompok')
        .select('target_putra, target_putri')
        .eq('desa_id', desa.id)

      if (kelompokTargets) {
        kelompokTargets.forEach((k) => {
          totalTargetPutra += k.target_putra
          totalTargetPutri += k.target_putri
        })
      }

      // Sum actual attendance
      desaAbsensi.forEach((item) => {
        totalHadirPutra += item.hadir_putra
        totalHadirPutri += item.hadir_putri
      })

      const persentasePutra = totalTargetPutra > 0 ? (totalHadirPutra / totalTargetPutra) * 100 : 0
      const persentasePutri = totalTargetPutri > 0 ? (totalHadirPutri / totalTargetPutri) * 100 : 0

      summaryData.push({
        desa_id: desa.id,
        nama_desa: desa.nama_desa,
        total_kelompok: kelompokCount || 0,
        total_target_putra: totalTargetPutra,
        total_target_putri: totalTargetPutri,
        total_hadir_putra: totalHadirPutra,
        total_hadir_putri: totalHadirPutri,
        persentase_putra: persentasePutra,
        persentase_putri: persentasePutri,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan Absensi</h1>
        <p className="text-muted-foreground">
          Laporan kehadiran semua desa dan kelompok
        </p>
      </div>

      <AbsensiTable
        data={summaryData}
        bulan={bulan}
        tahun={tahun}
        onFilterChange={(newBulan, newTahun) => {
          const url = new URL(window.location.href)
          url.searchParams.set('bulan', newBulan.toString())
          url.searchParams.set('tahun', newTahun.toString())
          window.location.href = url.toString()
        }}
      />
    </div>
  )
}