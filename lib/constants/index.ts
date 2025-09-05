export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  KOORDINATOR_DESA: 'koordinator_desa', 
  KOORDINATOR_DAERAH: 'koordinator_daerah',
  VIEWER: 'viewer'
} as const

export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.KOORDINATOR_DESA]: 'Koordinator Desa',
  [USER_ROLES.KOORDINATOR_DAERAH]: 'Koordinator Daerah',
  [USER_ROLES.VIEWER]: 'Viewer'
} as const

export const MONTHS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

export const CURRENT_YEAR = new Date().getFullYear()
export const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i)

export const DEFAULT_TARGET_PUTRA = 25
export const DEFAULT_TARGET_PUTRI = 0

export const DESA_KELOMPOK_DATA = {
  'Kapuk Melati': ['Melati A', 'Melati B', 'BGN'],
  'Jelambar': ['Indah', 'Damar', 'Jaya', 'Pejagalan'],
  'Cengkareng': ['Fajar A', 'Fajar B', 'Fajar C'],
  'Kebon Jahe': ['Kebon Jahe A', 'Kebon Jahe B', 'Garikas', 'Taniwan'],
  'Bandara': ['Rawel', 'Prima', 'Kamdur'],
  'Taman Kota': ['Rawa Buaya A', 'Rawa Buaya B', 'Taman Kota A', 'Taman Kota B'],
  'Kalideres': ['Tegal Alur A', 'Tegal Alur B', 'Prepedan A', 'Prepedan B', 'Kebon Kelapa'],
  'Cipondoh': ['Griya Permata', 'Semanan A', 'Semanan B', 'Pondok Bahar']
}

export const TOTAL_TARGET_DAERAH = 750 // 30 kelompok x 25 orang