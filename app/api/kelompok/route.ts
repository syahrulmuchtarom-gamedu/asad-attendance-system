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

export async function GET() {
  try {
    // Simple query without RLS
    const { data: kelompok, error } = await supabase
      .from('kelompok')
      .select('*')
      .order('nama_kelompok')

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
    const { nama_kelompok, desa_id, target_putra } = await request.json()

    if (!nama_kelompok || !desa_id || !target_putra) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kelompok')
      .insert([{ nama_kelompok, desa_id, target_putra }])
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
    const { id, nama_kelompok, desa_id, target_putra } = await request.json()

    if (!id || !nama_kelompok || !desa_id || !target_putra) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kelompok')
      .update({ nama_kelompok, desa_id, target_putra })
      .eq('id', id)
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
    return NextResponse.json({ error: 'Failed to update kelompok' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete kelompok' }, { status: 500 })
  }
}