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