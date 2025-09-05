'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { absensiSchema, type AbsensiInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import { Kelompok } from '@/types'
import { MONTHS, CURRENT_YEAR } from '@/lib/constants'
import { getMonthName } from '@/lib/utils'

interface AbsensiFormProps {
  kelompokList: Kelompok[]
  userId: string
  currentMonth: number
  currentYear: number
}

export function AbsensiForm({ kelompokList, userId, currentMonth, currentYear }: AbsensiFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKelompok, setSelectedKelompok] = useState<Kelompok | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => createClient(), [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<AbsensiInput>({
    resolver: zodResolver(absensiSchema),
    defaultValues: {
      bulan: currentMonth,
      tahun: currentYear,
      hadir_putra: 0,
      hadir_putri: 0,
    },
  })

  const watchedKelompokId = watch('kelompok_id')
  const watchedBulan = watch('bulan')
  const watchedTahun = watch('tahun')

  // Update selected kelompok when kelompok_id changes
  React.useEffect(() => {
    if (watchedKelompokId) {
      const kelompok = kelompokList.find(k => k.id === Number(watchedKelompokId))
      setSelectedKelompok(kelompok || null)
    }
  }, [watchedKelompokId, kelompokList])

  const onSubmit = async (data: AbsensiInput) => {
    try {
      setIsLoading(true)

      // Check if data already exists
      const { data: existingData, error: checkError } = await supabase
        .from('absensi')
        .select('id')
        .eq('kelompok_id', data.kelompok_id)
        .eq('bulan', data.bulan)
        .eq('tahun', data.tahun)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Gagal memeriksa data duplikat')
      }

      if (existingData) {
        toast({
          variant: "destructive",
          title: "Data Sudah Ada",
          description: `Absensi untuk kelompok ini pada ${getMonthName(data.bulan)} ${data.tahun} sudah ada`,
        })
        return
      }

      // Insert new data
      const { error } = await supabase
        .from('absensi')
        .insert({
          ...data,
          input_by: userId,
        })

      if (error) {
        throw error
      }

      toast({
        title: "Berhasil",
        description: "Data absensi berhasil disimpan",
      })

      // Reset form
      reset({
        kelompok_id: undefined,
        bulan: currentMonth,
        tahun: currentYear,
        hadir_putra: 0,
        hadir_putri: 0,
      })
      setSelectedKelompok(null)
      
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan data"
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Input Absensi Kelompok</CardTitle>
        <CardDescription>
          Masukkan data kehadiran putra (minggu ke-2) dan putri (minggu ke-4)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Periode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulan">Bulan</Label>
              <select
                id="bulan"
                {...register('bulan', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              {errors.bulan && (
                <p className="text-sm text-red-500">{errors.bulan.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <select
                id="tahun"
                {...register('tahun', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.tahun && (
                <p className="text-sm text-red-500">{errors.tahun.message}</p>
              )}
            </div>
          </div>

          {/* Kelompok */}
          <div className="space-y-2">
            <Label htmlFor="kelompok_id">Kelompok</Label>
            <select
              id="kelompok_id"
              {...register('kelompok_id', { valueAsNumber: true })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Pilih Kelompok</option>
              {kelompokList.map((kelompok) => (
                <option key={kelompok.id} value={kelompok.id}>
                  {kelompok.nama_kelompok}
                </option>
              ))}
            </select>
            {errors.kelompok_id && (
              <p className="text-sm text-red-500">{errors.kelompok_id.message}</p>
            )}
          </div>

          {/* Target Info */}
          {selectedKelompok && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Target Kelompok</span>
              </div>
              <div className="text-sm text-blue-800">
                <p>Putra: {selectedKelompok.target_putra} orang</p>
                <p>Putri: {selectedKelompok.target_putri} orang</p>
              </div>
            </div>
          )}

          {/* Kehadiran */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hadir_putra">Hadir Putra (Minggu ke-2)</Label>
              <Input
                id="hadir_putra"
                type="number"
                min="0"
                max="50"
                placeholder="0"
                {...register('hadir_putra', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.hadir_putra && (
                <p className="text-sm text-red-500">{errors.hadir_putra.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hadir_putri">Hadir Putri (Minggu ke-4)</Label>
              <Input
                id="hadir_putri"
                type="number"
                min="0"
                max="50"
                placeholder="0"
                {...register('hadir_putri', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.hadir_putri && (
                <p className="text-sm text-red-500">{errors.hadir_putri.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Menyimpan...' : 'Simpan Data Absensi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}