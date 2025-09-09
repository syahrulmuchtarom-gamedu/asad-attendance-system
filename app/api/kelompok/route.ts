import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = request.cookies
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    
    let query = supabase
      .from('kelompok')
      .select('*')
      .order('nama_kelompok')
    
    // Filter berdasarkan role dan desa
    if (user.role === 'koordinator_desa' && user.desa_id) {
      query = query.eq('desa_id', user.desa_id)
    }
    
    const { data: kelompok, error } = await query

    if (error) {
      console.error('Kelompok fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get desa names separately
    const { data: desa } = await supabase
      .from('desa')
      .select('id, nama_desa')

    const kelompokWithDesa = (kelompok || []).map(k => {
      const desaInfo = desa?.find(d => d.id === k.desa_id)
      return {
        ...k,
        desa_name: desaInfo?.nama_desa || 'Unknown'
      }
    })

    return NextResponse.json(kelompokWithDesa)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch kelompok' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = request.cookies
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    
    // Hanya super_admin yang bisa menambah kelompok
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { nama_kelompok, desa_id, target_putra, target_putri } = await request.json()

    if (!nama_kelompok || !desa_id || !target_putra || !target_putri) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kelompok')
      .insert([{ nama_kelompok, desa_id, target_putra, target_putri }])
      .select()
      .single()

    if (error) throw error

    // Get desa name separately
    const { data: desaData } = await supabase
      .from('desa')
      .select('nama_desa')
      .eq('id', desa_id)
      .single()

    return NextResponse.json({
      ...data,
      desa_name: desaData?.nama_desa || 'Unknown'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create kelompok' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = request.cookies
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    
    // Hanya super_admin yang bisa edit kelompok
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, nama_kelompok, desa_id, target_putra, target_putri } = await request.json()

    if (!id || !nama_kelompok || !desa_id || target_putra === undefined || target_putri === undefined) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    console.log('Updating kelompok:', { id, nama_kelompok, desa_id, target_putra, target_putri })

    const { data, error } = await supabase
      .from('kelompok')
      .update({ nama_kelompok, desa_id, target_putra, target_putri })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update kelompok error:', error)
      throw error
    }

    // Get desa name separately
    const { data: desaData } = await supabase
      .from('desa')
      .select('nama_desa')
      .eq('id', desa_id)
      .single()

    return NextResponse.json({
      ...data,
      desa_name: desaData?.nama_desa || 'Unknown'
    })
  } catch (error: any) {
    console.error('PUT kelompok error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update kelompok' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = request.cookies
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    
    // Hanya super_admin yang bisa hapus kelompok
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('kelompok')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to delete kelompok' 
    }, { status: 500 })
  }
}