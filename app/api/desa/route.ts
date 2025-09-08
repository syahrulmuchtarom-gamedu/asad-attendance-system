import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: desa, error } = await supabase
      .from('desa')
      .select('*')
      .order('nama_desa')

    if (error) throw error

    // Count kelompok for each desa
    const desaWithCount = await Promise.all(
      (desa || []).map(async (d) => {
        const { count } = await supabase
          .from('kelompok')
          .select('*', { count: 'exact', head: true })
          .eq('desa_id', d.id)
        
        return {
          ...d,
          kelompok_count: count || 0
        }
      })
    )

    return NextResponse.json(desaWithCount)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch desa' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
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
    const supabase = createClient()
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
    const supabase = createClient()
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