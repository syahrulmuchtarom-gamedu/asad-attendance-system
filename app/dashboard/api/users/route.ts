import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // Handle get settings (temporary workaround)
    if (action === 'get_settings') {
      const { data: settings, error } = await supabase
        .from('settings')
        .select('key, value, description')
        .in('key', ['admin_phone', 'admin_whatsapp'])
      
      if (error) {
        // Return default values if table doesn't exist
        return NextResponse.json({ 
          data: [
            { key: 'admin_phone', value: '021-1234-5678' },
            { key: 'admin_whatsapp', value: '0812-3456-7890' }
          ]
        })
      }
      
      return NextResponse.json({ data: settings })
    }
    
    // Regular users fetch
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
    const requestData = await request.json()
    
    // Handle settings update (temporary workaround)
    if (requestData.action === 'update_settings') {
      const { admin_phone, admin_whatsapp } = requestData
      
      if (!admin_phone || !admin_whatsapp) {
        return NextResponse.json({ 
          error: 'Nomor telepon dan WhatsApp harus diisi' 
        }, { status: 400 })
      }
      
      // Update or insert settings with proper conflict resolution
      const { error: phoneError } = await supabase
        .from('settings')
        .upsert({ 
          key: 'admin_phone',
          value: admin_phone,
          description: 'Nomor telepon admin untuk lupa password'
        }, {
          onConflict: 'key'
        })
      
      const { error: whatsappError } = await supabase
        .from('settings')
        .upsert({ 
          key: 'admin_whatsapp',
          value: admin_whatsapp,
          description: 'Nomor WhatsApp admin untuk lupa password'
        }, {
          onConflict: 'key'
        })
      
      if (phoneError || whatsappError) {
        throw phoneError || whatsappError
      }
      
      return NextResponse.json({ 
        message: 'Kontak admin berhasil diupdate'
      })
    }
    
    // Regular user creation
    const { username, password, full_name, role, desa_id } = requestData

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
    const { id, username, password, full_name, role, desa_id, is_active, resetPassword } = await request.json()

    const updateData: any = {
      username,
      full_name,
      role,
      desa_id: role === 'koordinator_desa' ? desa_id : null,
      is_active
    }

    // Reset password to default (username + 123)
    if (resetPassword) {
      updateData.password = username + '123'
    } else if (password) {
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
      message: resetPassword ? `Password direset ke: ${username}123` : 'User updated successfully',
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
    const { data: absensiData, error: absensiError } = await supabase
      .from('absensi')
      .select('id')
      .eq('input_by', id)
      .limit(1)

    if (absensiError) {
      console.error('Error checking absensi:', absensiError)
    }

    if (absensiData && absensiData.length > 0) {
      // Jika user pernah input absensi, set input_by ke NULL atau user lain
      const { error: updateError } = await supabase
        .from('absensi')
        .update({ input_by: null })
        .eq('input_by', id)
      
      if (updateError) {
        console.error('Error updating absensi:', updateError)
        throw updateError
      }
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