import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    console.log('Creating user suppcon in users table...')

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username: 'suppcon',
        password: 'AdInsTOPAJA2018%qaz',
        full_name: 'Super Admin',
        role: 'super_admin',
        desa_id: null,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User created successfully',
      user
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}