// DEBUG: Cek session Astrida di browser console
// Jalankan di browser console saat login sebagai Astrida

console.log('=== DEBUG SESSION ASTRIDA ===');

// Cek cookie
const cookies = document.cookie.split(';');
const sessionCookie = cookies.find(c => c.trim().startsWith('user_session='));
console.log('🍪 Session Cookie:', sessionCookie);

if (sessionCookie) {
  try {
    const cookieValue = sessionCookie.split('=')[1];
    const sessionData = JSON.parse(decodeURIComponent(cookieValue));
    console.log('✅ Session Data:', sessionData);
    console.log('👤 Role:', sessionData.role);
    console.log('🏠 Desa ID:', sessionData.desa_id);
  } catch (e) {
    console.error('❌ Error parsing cookie:', e);
  }
}

// Cek localStorage
const localData = localStorage.getItem('user_session');
console.log('💾 LocalStorage:', localData);

if (localData) {
  try {
    const sessionData = JSON.parse(localData);
    console.log('✅ LocalStorage Data:', sessionData);
  } catch (e) {
    console.error('❌ Error parsing localStorage:', e);
  }
}

// Test API call
fetch('/api/kelompok?desa=Kalideres')
  .then(r => r.json())
  .then(data => console.log('📊 Kelompok API Response:', data))
  .catch(e => console.error('❌ Kelompok API Error:', e));