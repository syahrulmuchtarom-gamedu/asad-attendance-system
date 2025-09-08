const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://lbrfdcpssluocymcdiun.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicmZkY3Bzc2x1b2N5bWNkaXVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA4ODkwOSwiZXhwIjoyMDcyNjY0OTA5fQ.QFnYj3mntcdNe3iPKF15pDNl5af42zFTxLXEpySbHyM'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'suppcon@admin.com',
      password: 'AdInsTOPAJA2018%qaz',
      email_confirm: true,
      user_metadata: { 
        full_name: 'Super Admin' 
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return
    }

    console.log('User created in auth:', authData.user.id)

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'suppcon@admin.com',
        full_name: 'Super Admin',
        role: 'super_admin',
        desa_id: null
      })
      .select()

    if (profileError) {
      console.error('Profile error:', profileError)
      return
    }

    console.log('Profile created:', profileData)
    console.log('✅ Admin user created successfully!')
    console.log('Email: suppcon@admin.com')
    console.log('Password: AdInsTOPAJA2018%qaz')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createAdminUser()