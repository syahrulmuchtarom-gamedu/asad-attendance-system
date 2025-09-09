'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Target, TrendingUp, Plus, FileText } from 'lucide-react'

interface DashboardStats {
  totalKelompok: number
  sudahInput: number
  belumInput: number
  persentaseKehadiran: number
  totalHadir: number
  totalTarget: number
  namaUser: string
  namaDesa: string
}

export default function KoordinatorDesaDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalKelompok: 0,
    sudahInput: 0,
    belumInput: 0,
    persentaseKehadiran: 0,
    totalHadir: 0,
    totalTarget: 0,
    namaUser: '',
    namaDesa: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch kelompok data
      const kelompokResponse = await fetch('/api/kelompok')
      const kelompokData = await kelompokResponse.json()
      
      // Fetch absensi data untuk bulan ini
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      const absensiResponse = await fetch(`/api/absensi?bulan=${currentMonth}&tahun=${currentYear}`)
      const absensiResult = await absensiResponse.json()
      const absensiData = absensiResult.data || []
      
      // Calculate stats
      const totalKelompok = kelompokData.length
      const sudahInput = absensiData.length
      const belumInput = totalKelompok - sudahInput
      
      const totalTarget = kelompokData.reduce((sum: number, k: any) => 
        sum + (k.target_putra || 0) + (k.target_putri || 0), 0)
      const totalHadir = absensiData.reduce((sum: number, a: any) => 
        sum + (a.hadir_putra || 0) + (a.hadir_putri || 0), 0)
      const persentaseKehadiran = totalTarget > 0 ? (totalHadir / totalTarget) * 100 : 0
      
      const namaDesa = kelompokData[0]?.desa_name || 'Unknown'
      
      setStats({
        totalKelompok,
        sudahInput,
        belumInput,
        persentaseKehadiran,
        totalHadir,
        totalTarget,
        namaUser: 'Koordinator',
        namaDesa
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Koordinator Desa</h1>
          <p className="text-muted-foreground">
            Selamat datang, {stats.namaUser} - Desa {stats.namaDesa}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/absensi">
              <Plus className="mr-2 h-4 w-4" />
              Input Absensi
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/laporan">
              <FileText className="mr-2 h-4 w-4" />
              Lihat Laporan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelompok</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKelompok}</div>
            <p className="text-xs text-muted-foreground">
              Kelompok di desa {stats.namaDesa}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Input</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sudahInput}</div>
            <p className="text-xs text-muted-foreground">
              Dari {stats.totalKelompok} kelompok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Input</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.belumInput}</div>
            <p className="text-xs text-muted-foreground">
              Kelompok tersisa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.persentaseKehadiran.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalHadir} dari {stats.totalTarget} target
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}