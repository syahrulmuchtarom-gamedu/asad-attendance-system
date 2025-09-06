// Script untuk membuat user koordinator desa test
// Jalankan di browser console atau buat API endpoint

const testUsers = [
  {
    id: 2,
    username: 'koordinator1',
    full_name: 'Koordinator Kapuk Melati',
    role: 'koordinator_desa',
    desa_id: 1
  },
  {
    id: 3,
    username: 'koordinator2', 
    full_name: 'Koordinator Jelambar',
    role: 'koordinator_desa',
    desa_id: 2
  }
]

// Untuk test, bisa login dengan:
// Username: koordinator1, Password: admin123
// Username: koordinator2, Password: admin123

console.log('Test users created:', testUsers)