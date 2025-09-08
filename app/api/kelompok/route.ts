import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: kelompok, error } = await supabase
      .from('kelompok')
      .select(`
        *,
        desa!inner(nama_desa)
      `)
      .order('nama_kelompok')

    if (error) throw error

    const kelompokWithDesa = kelompok?.map(k => ({
      ...k,
      desa_name: k.desa?.nama_desa
    }))

    return NextResponse.json(kelompokWithDesa)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch kelompok' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { nama_kelompok, desa_id, target_putra } = await request.json()

    if (!nama_kelompok || !desa_id || !target_putra) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kelompok')
      .insert([{ nama_kelompok, desa_id, target_putra }])
      .select(`
        *,
        desa(nama_desa)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({
      ...data,
      desa_name: data.desa?.nama_desa
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create kelompok' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { id, nama_kelompok, desa_id, target_putra } = await request.json()

    if (!id || !nama_kelompok || !desa_id || !target_putra) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kelompok')
      .update({ nama_kelompok, desa_id, target_putra })
      .eq('id', id)
      .select(`
        *,
        desa(nama_desa)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({
      ...data,
      desa_name: data.desa?.nama_desa
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update kelompok' }, { status: 500 })
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
      .from('kelompok')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete kelompok' }, { status: 500 })
  }
}