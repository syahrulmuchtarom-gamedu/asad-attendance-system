import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const { searchParams } = new URL(request.url)
    const bulan = searchParams.get('bulan')
    const tahun = searchParams.get('tahun')

    const supabase = createAdminClient()
    
    let query = supabase
      .from('absensi')
      .select(`
        *,
        kelompok!inner(
          id,
          nama_kelompok,
          desa_id,
          target_putra,
          target_putri,
          desa!inner(
            id,
            nama_desa
          )
        )
      `)
    
    // Filter berdasarkan role dan desa
    if (user.role === 'koordinator_desa' && user.desa_id) {
      query = query.eq('kelompok.desa_id', user.desa_id)
    }
    // Super admin dan role lain melihat semua data (tidak ada filter)
    
    if (bulan) query = query.eq('bulan', bulan)
    if (tahun) query = query.eq('tahun', tahun)
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch absensi data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const data = await request.json()
    const supabase = createAdminClient()

    // Validasi: koordinator desa hanya bisa input untuk kelompok di desanya
    if (user.role === 'koordinator_desa') {
      const { data: kelompok } = await supabase
        .from('kelompok')
        .select('desa_id')
        .eq('id', data.kelompok_id)
        .single()
      
      if (!kelompok || kelompok.desa_id !== user.desa_id) {
        return NextResponse.json({ 
          error: 'Anda tidak memiliki akses untuk kelompok ini' 
        }, { status: 403 })
      }
    }

    // Check if data already exists
    const { data: existing } = await supabase
      .from('absensi')
      .select('*')
      .eq('kelompok_id', data.kelompok_id)
      .eq('bulan', data.bulan)
      .eq('tahun', data.tahun)
      .single()

    if (existing) {
      return NextResponse.json({ 
        error: 'Data sudah ada untuk kelompok ini pada bulan tersebut' 
      }, { status: 400 })
    }

    // Insert new data
    const { data: newAbsensi, error } = await supabase
      .from('absensi')
      .insert({
        kelompok_id: data.kelompok_id,
        bulan: data.bulan,
        tahun: data.tahun,
        hadir_putra: data.hadir_putra,
        hadir_putri: data.hadir_putri,
        input_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Data absensi berhasil disimpan',
      data: newAbsensi 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Gagal menyimpan data' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const data = await request.json()
    const supabase = createAdminClient()

    // Validasi: koordinator desa hanya bisa update untuk kelompok di desanya
    if (user.role === 'koordinator_desa') {
      const { data: kelompok } = await supabase
        .from('kelompok')
        .select('desa_id')
        .eq('id', data.kelompok_id)
        .single()
      
      if (!kelompok || kelompok.desa_id !== user.desa_id) {
        return NextResponse.json({ 
          error: 'Anda tidak memiliki akses untuk kelompok ini' 
        }, { status: 403 })
      }
    }

    // Try to update first, if no rows affected, insert instead (UPSERT)
    const { data: updatedAbsensi, error: updateError } = await supabase
      .from('absensi')
      .update({
        hadir_putra: data.hadir_putra,
        hadir_putri: data.hadir_putri,
        updated_at: new Date().toISOString()
      })
      .eq('kelompok_id', data.kelompok_id)
      .eq('bulan', data.bulan)
      .eq('tahun', data.tahun)
      .select()

    // If update found no rows, insert new data
    if (updateError && updateError.code === 'PGRST116') {
      console.log('No existing data found, inserting new record...')
      
      const { data: newAbsensi, error: insertError } = await supabase
        .from('absensi')
        .insert({
          kelompok_id: data.kelompok_id,
          bulan: data.bulan,
          tahun: data.tahun,
          hadir_putra: data.hadir_putra,
          hadir_putri: data.hadir_putri,
          input_by: user.id
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert absensi error:', insertError)
        throw insertError
      }

      return NextResponse.json({ 
        message: 'Data absensi berhasil disimpan',
        data: newAbsensi 
      })
    }
    
    if (updateError) {
      console.error('Update absensi error:', updateError)
      throw updateError
    }

    return NextResponse.json({ 
      message: 'Data absensi berhasil diupdate',
      data: updatedAbsensi 
    })
  } catch (error) {
    console.error('PUT API Error:', error)
    return NextResponse.json({ 
      error: 'Gagal mengupdate data' 
    }, { status: 500 })
  }
}