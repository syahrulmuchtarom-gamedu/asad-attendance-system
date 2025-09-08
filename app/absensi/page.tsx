import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AbsensiForm } from '@/components/forms/absensi-form'

// Mock data kelompok per desa
const KELOMPOK_DATA = {
  1: ['Melati A', 'Melati B', 'BGN'], // Kapuk Melati
  2: ['Indah', 'Damar', 'Jaya', 'Pejagalan'], // Jelambar
  3: ['Fajar A', 'Fajar B', 'Fajar C'], // Cengkareng
  4: ['Kebon Jahe A', 'Kebon Jahe B', 'Garikas', 'Taniwan'], // Kebon Jahe
  5: ['Rawel', 'Prima', 'Kamdur'], // Bandara
  6: ['Rawa Buaya A', 'Rawa Buaya B', 'Taman Kota A', 'Taman Kota B'], // Taman Kota
  7: ['Tegal Alur A', 'Tegal Alur B', 'Prepedan A', 'Prepedan B', 'Kebon Kelapa'], // Kalideres
  8: ['Griya Permata', 'Semanan A', 'Semanan B', 'Pondok Bahar'] // Cipondoh
}

export default async function AbsensiPage() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      redirect('/login')
    }

    const user = JSON.parse(sessionCookie)

    if (user.role !== 'koordinator_desa' || !user.desa_id) {
      redirect('/dashboard')
    }

    // Get kelompok for this desa
    const kelompokNames = KELOMPOK_DATA[user.desa_id as keyof typeof KELOMPOK_DATA] || []
    const kelompokList = kelompokNames.map((nama, index) => ({
      id: (user.desa_id * 10) + index + 1,
      nama_kelompok: nama,
      desa_id: user.desa_id,
      target_putra: 25,
      target_putri: 0,
      created_at: new Date().toISOString()
    }))

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Input Absensi</h1>
          <p className="text-muted-foreground">
            Input data kehadiran kelompok untuk desa Anda
          </p>
        </div>

        <AbsensiForm
          kelompokList={kelompokList}
          userId={user.id.toString()}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    )
  } catch (error) {
    console.error('Absensi page error:', error)
    redirect('/dashboard')
  }
}