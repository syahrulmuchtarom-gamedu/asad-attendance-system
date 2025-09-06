import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock database - in production use real database
let absensiData: any[] = []

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie)
    const data = await request.json()

    // Check if data already exists
    const existing = absensiData.find(item => 
      item.kelompok_id === data.kelompok_id &&
      item.bulan === data.bulan &&
      item.tahun === data.tahun
    )

    if (existing) {
      return NextResponse.json({ 
        error: 'Data sudah ada untuk kelompok ini pada bulan tersebut' 
      }, { status: 400 })
    }

    // Add new data
    const newAbsensi = {
      id: absensiData.length + 1,
      ...data,
      input_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    absensiData.push(newAbsensi)

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