export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type UserRole = 'super_admin' | 'koordinator_desa' | 'koordinator_daerah' | 'viewer'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          desa_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: UserRole
          desa_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          desa_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      desa: {
        Row: {
          id: number
          nama_desa: string
          created_at: string
        }
        Insert: {
          id?: number
          nama_desa: string
          created_at?: string
        }
        Update: {
          id?: number
          nama_desa?: string
          created_at?: string
        }
      }
      kelompok: {
        Row: {
          id: number
          nama_kelompok: string
          desa_id: number
          target_putra: number
          target_putri: number
          created_at: string
        }
        Insert: {
          id?: number
          nama_kelompok: string
          desa_id: number
          target_putra?: number
          target_putri?: number
          created_at?: string
        }
        Update: {
          id?: number
          nama_kelompok?: string
          desa_id?: number
          target_putra?: number
          target_putri?: number
          created_at?: string
        }
      }
      absensi: {
        Row: {
          id: number
          kelompok_id: number
          bulan: number
          tahun: number
          hadir_putra: number
          hadir_putri: number
          input_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          kelompok_id: number
          bulan: number
          tahun: number
          hadir_putra?: number
          hadir_putri?: number
          input_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          kelompok_id?: number
          bulan?: number
          tahun?: number
          hadir_putra?: number
          hadir_putri?: number
          input_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}