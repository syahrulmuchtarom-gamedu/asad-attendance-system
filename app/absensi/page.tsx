import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AbsensiForm } from '@/components/forms/absensi-form'

export default async function AbsensiPage() {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      redirect('/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile || profile.role !== 'koordinator_desa' || !profile.desa_id) {
      redirect('/dashboard')
    }

    // Get kelompok for this desa
    const { data: kelompokList, error: kelompokError } = await supabase
      .from('kelompok')
      .select('*')
      .eq('desa_id', profile.desa_id)
      .order('nama_kelompok')

    if (kelompokError) {
      console.error('Error fetching kelompok:', kelompokError)
    }

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
          kelompokList={kelompokList || []}
          userId={session.user.id}
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