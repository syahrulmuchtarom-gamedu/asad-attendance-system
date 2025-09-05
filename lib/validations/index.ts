import { z } from 'zod'

const USER_ROLES = ['super_admin', 'koordinator_desa', 'koordinator_daerah', 'viewer'] as const
const MAX_ATTENDANCE = 50
const MAX_TARGET = 100

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  role: z.enum(USER_ROLES),
  desa_id: z.number().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"]
})

export const absensiSchema = z.object({
  kelompok_id: z.number().min(1, 'Pilih kelompok'),
  bulan: z.number().min(1).max(12, 'Bulan tidak valid'),
  tahun: z.number().min(2020).max(new Date().getFullYear() + 5, 'Tahun tidak valid'),
  hadir_putra: z.number().min(0).max(MAX_ATTENDANCE, 'Jumlah hadir putra tidak valid'),
  hadir_putri: z.number().min(0).max(MAX_ATTENDANCE, 'Jumlah hadir putri tidak valid')
})

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  role: z.enum(USER_ROLES).optional(),
  desa_id: z.number().optional()
})

export const kelompokSchema = z.object({
  nama_kelompok: z.string().min(2, 'Nama kelompok minimal 2 karakter'),
  desa_id: z.number().min(1, 'Pilih desa'),
  target_putra: z.number().min(0).max(MAX_TARGET, 'Target putra tidak valid'),
  target_putri: z.number().min(0).max(MAX_TARGET, 'Target putri tidak valid')
})

export const desaSchema = z.object({
  nama_desa: z.string().min(2, 'Nama desa minimal 2 karakter')
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AbsensiInput = z.infer<typeof absensiSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type KelompokInput = z.infer<typeof kelompokSchema>
export type DesaInput = z.infer<typeof desaSchema>