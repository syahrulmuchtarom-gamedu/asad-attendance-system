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
    
    const { data: desa, error } = await supabase
      .from('desa')
      .select('*')
      .order('nama_desa')

    if (error) {
      console.error('Desa fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Simple approach - just return desa without count for now
    const desaWithCount = (desa || []).map(d => ({
      ...d,
      kelompok_count: 0 // Will be updated later
    }))

    return NextResponse.json(desaWithCount)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch desa' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama_desa } = await request.json()

    if (!nama_desa) {
      return NextResponse.json({ error: 'Nama desa required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('desa')
      .insert([{ nama_desa }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create desa' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nama_desa } = await request.json()

    if (!id || !nama_desa) {
      return NextResponse.json({ error: 'ID and nama_desa required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('desa')
      .update({ nama_desa })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update desa' }, { status: 500 })
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
      .from('desa')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete desa' }, { status: 500 })
  }
}