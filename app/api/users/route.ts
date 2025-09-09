import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data: users })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { username, password, full_name, role, desa_id } = await request.json()

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        password,
        full_name,
        role,
        desa_id: role === 'koordinator_desa' ? desa_id : null,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'User created successfully',
      user 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { id, username, password, full_name, role, desa_id, is_active } = await request.json()

    const updateData: any = {
      username,
      full_name,
      role,
      desa_id: role === 'koordinator_desa' ? desa_id : null,
      is_active
    }

    if (password) {
      updateData.password = password
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'User updated successfully',
      user 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Cek apakah user pernah input absensi
    const { data: absensiData } = await supabase
      .from('absensi')
      .select('id')
      .eq('input_by', id)
      .limit(1)

    if (absensiData && absensiData.length > 0) {
      // Jika user pernah input absensi, set input_by ke NULL atau user lain
      await supabase
        .from('absensi')
        .update({ input_by: null })
        .eq('input_by', id)
    }

    // Sekarang hapus user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ 
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}