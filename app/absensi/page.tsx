'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Calendar, Save, Edit, CheckCircle, AlertCircle } from 'lucide-react'

interface Kelompok {
  id: number
  nama_kelompok: string
  target_putra: number
  target_putri: number
  desa_name?: string
}

interface Desa {
  id: number
  nama_desa: string
  kelompok_count: number
  total_target: number
}

export default function AbsensiPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(2025)
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([])
  const [desaList, setDesaList] = useState<Desa[]>([])
  const [absensiData, setAbsensiData] = useState<{[key: number]: {hadir_putra: number, hadir_putri: number}}>({})
  const [existingData, setExistingData] = useState<{[key: number]: {hadir_putra: number, hadir_putri: number}}>({})
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dataStatus, setDataStatus] = useState<'loading' | 'new' | 'existing'>('loading')
  const [selectedDesa, setSelectedDesa] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [showDesaList, setShowDesaList] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchUserRole()
  }, [])
  
  useEffect(() => {
    if (userRole) {
      if (userRole === 'super_admin' || userRole === 'astrida') {
        fetchDesaList()
      } else {
        fetchKelompok()
      }
    }
  }, [userRole])

  useEffect(() => {
    if (kelompokList.length > 0 && !showDesaList) {
      fetchExistingData()
    }
  }, [selectedMonth, selectedYear, kelompokList, showDesaList])

  const fetchUserRole = () => {
    try {
      if (typeof window !== 'undefined') {
        console.log('🍪 All cookies:', document.cookie)
        
        // TRY COOKIE FIRST
        const cookies = document.cookie.split(';')
        const sessionCookie = cookies.find(c => c.trim().startsWith('user_session='))
        
        let sessionData = null
        
        if (sessionCookie) {
          const cookieValue = sessionCookie.split('=')[1]
          console.log('🔑 Found cookie, parsing...')
          sessionData = JSON.parse(decodeURIComponent(cookieValue))
          console.log('✅ User from COOKIE:', sessionData.role)
        } else {
          console.log('❌ No cookie found, trying localStorage...')
          
          // FALLBACK TO LOCALSTORAGE
          const localData = localStorage.getItem('user_session')
          if (localData) {
            sessionData = JSON.parse(localData)
            console.log('✅ User from LOCALSTORAGE:', sessionData.role)
          } else {
            console.log('❌ No session data found anywhere')
          }
        }
        
        if (sessionData && sessionData.role) {
          setUserRole(sessionData.role)
          setIsLoading(false)
          
          if (sessionData.role === 'super_admin' || sessionData.role === 'astrida') {
            console.log('✅ Setting showDesaList = true for super_admin/astrida')
            setShowDesaList(true)
          } else {
            console.log('✅ Setting showDesaList = false for role:', sessionData.role)
            setShowDesaList(false)
          }
        } else {
          console.log('❌ No valid session data')
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('❌ Error getting user role:', error)
      setIsLoading(false)
    }
  }

  const fetchDesaList = async () => {
    try {
      const response = await fetch('/api/desa')
      if (response.ok) {
        const data = await response.json()
        setDesaList(data)
      }
    } catch (error) {
      console.error('Error fetching desa list:', error)
    }
  }

  const fetchKelompok = async (desaName?: string) => {
    try {
      let url = '/api/kelompok'
      if (desaName) {
        url += `?desa=${encodeURIComponent(desaName)}`
      }
      console.log('🔍 KELOMPOK - Fetching from:', url, 'for role:', userRole)
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ KELOMPOK - Received data count:', data.length)
        setKelompokList(data)
      } else {
        console.error('❌ KELOMPOK - Error response:', response.status)
      }
    } catch (error) {
      console.error('❌ KELOMPOK - Fetch error:', error)
    }
  }

  const fetchExistingData = async () => {
    try {
      setDataStatus('loading')
      console.log('🔍 FETCH - Getting existing data for:', { bulan: selectedMonth, tahun: selectedYear, userRole })
      
      const response = await fetch(`/api/absensi?bulan=${selectedMonth}&tahun=${selectedYear}`)
      const result = await response.json()
      
      console.log('📥 FETCH - Response:', response.status, result)
      
      if (response.ok && result.data && result.data.length > 0) {
        // Ada data existing - mode edit
        console.log('✅ FETCH - Found existing data, count:', result.data.length)
        const existingMap: {[key: number]: {hadir_putra: number, hadir_putri: number}} = {}
        const inputMap: {[key: number]: {hadir_putra: number, hadir_putri: number}} = {}
        
        result.data.forEach((item: any) => {
          existingMap[item.kelompok_id] = {
            hadir_putra: item.hadir_putra || 0,
            hadir_putri: item.hadir_putri || 0
          }
          inputMap[item.kelompok_id] = {
            hadir_putra: item.hadir_putra || 0,
            hadir_putri: item.hadir_putri || 0
          }
        })
        
        setExistingData(existingMap)
        setAbsensiData(inputMap)
        setIsEditMode(true)
        setDataStatus('existing')
      } else {
        // Tidak ada data - mode input baru
        console.log('ℹ️ FETCH - No existing data found, setting new mode')
        setExistingData({})
        setAbsensiData({})
        setIsEditMode(false)
        setDataStatus('new')
      }
    } catch (error) {
      console.error('❌ FETCH - Error fetching existing data:', error)
      setDataStatus('new')
    }
  }

  const handleInputChange = (kelompokId: number, field: 'hadir_putra' | 'hadir_putri', value: string) => {
    const numValue = parseInt(value) || 0
    setAbsensiData(prev => ({
      ...prev,
      [kelompokId]: {
        ...prev[kelompokId],
        [field]: numValue
      }
    }))
  }

  const handleDesaClick = async (desaName: string) => {
    setSelectedDesa(desaName)
    setShowDesaList(false)
    await fetchKelompok(desaName)
    // Reset data when switching desa
    setAbsensiData({})
    setExistingData({})
    setIsEditMode(false)
    setDataStatus('loading')
  }

  const handleBackToDesa = () => {
    setShowDesaList(true)
    setSelectedDesa('')
    setKelompokList([])
    setAbsensiData({})
    setExistingData({})
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      console.log('🚀 SUBMIT - User Role:', userRole)
      console.log('🚀 SUBMIT - Kelompok List:', kelompokList.length)
      console.log('🚀 SUBMIT - Absensi Data:', absensiData)
      
      // Selalu gunakan PUT method untuk UPSERT functionality
      for (const kelompok of kelompokList) {
        const data = absensiData[kelompok.id]
        if (data !== undefined && (data.hadir_putra >= 0 || data.hadir_putri >= 0)) {
          const submitData = {
            kelompok_id: kelompok.id,
            bulan: selectedMonth,
            tahun: selectedYear,
            hadir_putra: data.hadir_putra || 0,
            hadir_putri: data.hadir_putri || 0
          }
          
          console.log('📤 SUBMIT - Sending data for kelompok:', kelompok.nama_kelompok, submitData)
          
          const response = await fetch('/api/absensi', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
          })

          const result = await response.json()
          console.log('📥 SUBMIT - Response:', response.status, result)

          if (!response.ok) {
            console.error('❌ SUBMIT - Error for kelompok:', kelompok.nama_kelompok, result)
            throw new Error(result.error || 'Gagal menyimpan data')
          }
        }
      }
      
      console.log('✅ SUBMIT - All data saved successfully')
      alert('Data absensi berhasil disimpan!')
      
      // Refresh data setelah submit
      await fetchExistingData()
      
      // Jika bukan super admin, pindah ke bulan saat ini setelah submit
      if (userRole !== 'super_admin' && userRole !== 'astrida') {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        setSelectedMonth(currentMonth)
        setSelectedYear(currentYear)
      }
      
      // Jika super admin atau astrida, kembali ke daftar desa setelah berhasil
      if (userRole === 'super_admin' || userRole === 'astrida') {
        setTimeout(() => {
          handleBackToDesa()
        }, 1000)
      }
    } catch (error: any) {
      console.error('❌ SUBMIT - Error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getTotalTarget = () => {
    return kelompokList.reduce((sum, k) => sum + k.target_putra + k.target_putri, 0)
  }

  const getTotalHadir = () => {
    return Object.values(absensiData).reduce((sum, data) => 
      sum + (data?.hadir_putra || 0) + (data?.hadir_putri || 0), 0
    )
  }

  console.log('🎯 Render state:', { userRole, showDesaList, isClient, isLoading, kelompokCount: kelompokList.length })
  
  // Show loading while fetching user role
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  // SHOW DESA LIST FOR SUPER ADMIN & ASTRIDA WHEN showDesaList = true
  if ((userRole === 'super_admin' || userRole === 'astrida') && showDesaList && isClient) {
    console.log('📋 FORCE Rendering desa list for super admin/astrida')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Input Absensi</h1>
          <p className="text-muted-foreground">
            Pilih desa untuk input data kehadiran bulanan
          </p>
        </div>

        {/* Filter Periode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Periode Absensi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label>Bulan</Label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Januari</SelectItem>
                    <SelectItem value="2">Februari</SelectItem>
                    <SelectItem value="3">Maret</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">Mei</SelectItem>
                    <SelectItem value="6">Juni</SelectItem>
                    <SelectItem value="7">Juli</SelectItem>
                    <SelectItem value="8">Agustus</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">Oktober</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">Desember</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 16 }, (_, i) => {
                      const year = 2025 + i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daftar Desa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pilih Desa untuk Input Absensi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                'Kalideres', 'Kapuk Melati', 'Jelambar', 'Cengkareng',
                'Kebon Jahe', 'Bandara', 'Taman Kota', 'Cipondoh'
              ].map((desaName) => (
                <Card 
                  key={desaName} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleDesaClick(desaName)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">{desaName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Klik untuk input absensi
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Input Absensi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Regular form for koordinator desa or super admin after selecting desa
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Input Absensi {selectedDesa && `- ${selectedDesa}`}
          </h1>
          <p className="text-muted-foreground">
            Input data kehadiran bulanan per kelompok
          </p>
        </div>
        {(userRole === 'super_admin' || userRole === 'astrida') && selectedDesa && (
          <Button variant="outline" onClick={handleBackToDesa}>
            ← Kembali ke Daftar Desa
          </Button>
        )}
      </div>

      {/* Filter Periode - tampil untuk koordinator desa atau super admin yang sudah pilih desa */}
      {((userRole !== 'super_admin' && userRole !== 'astrida') || selectedDesa) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Periode Absensi {selectedDesa && `- ${selectedDesa}`}
              </div>
              {dataStatus !== 'loading' && (
                <div className="flex items-center gap-2">
                  {dataStatus === 'existing' ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Data Tersimpan
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Belum Ada Data
                    </div>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label>Bulan</Label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Januari</SelectItem>
                    <SelectItem value="2">Februari</SelectItem>
                    <SelectItem value="3">Maret</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">Mei</SelectItem>
                    <SelectItem value="6">Juni</SelectItem>
                    <SelectItem value="7">Juli</SelectItem>
                    <SelectItem value="8">Agustus</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">Oktober</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">Desember</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 16 }, (_, i) => {
                      const year = 2025 + i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTarget()}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalHadir()}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Persentase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalTarget() > 0 ? ((getTotalHadir() / getTotalTarget()) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Kehadiran</p>
          </CardContent>
        </Card>
      </div>

      {/* Form Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Input Data Kehadiran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kelompokList.map((kelompok) => {
              const hasExistingData = existingData[kelompok.id] !== undefined
              const currentData = absensiData[kelompok.id]
              const isDataChanged = hasExistingData && currentData && (
                currentData.hadir_putra !== existingData[kelompok.id]?.hadir_putra ||
                currentData.hadir_putri !== existingData[kelompok.id]?.hadir_putri
              )
              
              return (
                <div key={kelompok.id} className={`border rounded-lg p-4 ${
                  hasExistingData ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-border'
                } ${isDataChanged ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">
                      {kelompok.nama_kelompok}
                      {kelompok.desa_name && (userRole === 'super_admin' || userRole === 'astrida') && (
                        <span className="text-sm text-muted-foreground ml-2">({kelompok.desa_name})</span>
                      )}
                    </h3>
                    {hasExistingData && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Tersimpan
                      </div>
                    )}
                    {isDataChanged && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                        <Edit className="h-3 w-3" />
                        Diubah
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Hadir Putra (Target: {kelompok.target_putra})</Label>
                      <Input
                        type="number"
                        min="0"
                        max={kelompok.target_putra}
                        value={absensiData[kelompok.id]?.hadir_putra ?? ''}
                        onChange={(e) => handleInputChange(kelompok.id, 'hadir_putra', e.target.value)}
                        placeholder="0"
                        className={hasExistingData ? 'bg-background border-green-300 dark:border-green-700' : ''}
                      />
                    </div>
                    <div>
                      <Label>Hadir Putri (Target: {kelompok.target_putri})</Label>
                      <Input
                        type="number"
                        min="0"
                        max={kelompok.target_putri}
                        value={absensiData[kelompok.id]?.hadir_putri ?? ''}
                        onChange={(e) => handleInputChange(kelompok.id, 'hadir_putri', e.target.value)}
                        placeholder="0"
                        className={hasExistingData ? 'bg-background border-green-300 dark:border-green-700' : ''}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || dataStatus === 'loading' || kelompokList.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}