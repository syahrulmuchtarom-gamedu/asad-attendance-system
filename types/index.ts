export type UserRole = 'super_admin' | 'koordinator_desa' | 'koordinator_daerah' | 'viewer' | 'astrida'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  desa_id: number | null
  created_at: string
  updated_at: string
}

export interface Desa {
  id: number
  nama_desa: string
  created_at: string
}

export interface Kelompok {
  id: number
  nama_kelompok: string
  desa_id: number
  target_putra: number
  target_putri: number
  created_at: string
  desa?: Desa
}

export interface Absensi {
  id: number
  kelompok_id: number
  bulan: number
  tahun: number
  hadir_putra: number
  hadir_putri: number
  input_by: string
  created_at: string
  updated_at: string
  kelompok?: Kelompok
}

export interface AbsensiInput {
  kelompok_id: number
  bulan: number
  tahun: number
  hadir_putra: number
  hadir_putri: number
}

export interface AbsensiSummary {
  desa_id: number
  nama_desa: string
  total_kelompok: number
  total_target_putra: number
  total_target_putri: number
  total_hadir_putra: number
  total_hadir_putri: number
  persentase_putra: number
  persentase_putri: number
}

export interface DashboardStats {
  total_desa: number
  total_kelompok: number
  total_target: number
  total_hadir: number
  persentase_keseluruhan: number
  bulan_aktif: number
  tahun_aktif: number
}