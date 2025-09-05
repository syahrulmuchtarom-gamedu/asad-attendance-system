# 🚀 Quick Start Guide - Sistem Absensi ASAD

Panduan cepat untuk menjalankan Sistem Absensi ASAD dalam 10 menit!

## ⚡ Prerequisites

Pastikan Anda sudah install:
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- Akun [Supabase](https://supabase.com) (gratis)

## 🏃‍♂️ Quick Setup (5 menit)

### 1. Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd attendance-system-asad

# Install dependencies
npm install
```

### 2. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Copy URL dan Anon Key dari Settings > API
3. Buka SQL Editor dan jalankan script dari `supabase-schema.sql`

### 3. Environment Setup
```bash
# Copy environment file
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

## 👤 Create First User

### Method 1: Via Application
1. Buka aplikasi di browser
2. Klik "Register" (jika ada) atau gunakan Supabase Auth UI
3. Daftar dengan email dan password

### Method 2: Via Supabase Dashboard
1. Buka Supabase Dashboard > Authentication > Users
2. Klik "Add User"
3. Masukkan email dan password

### Set User Role
Setelah user dibuat, set role di SQL Editor:
```sql
-- Set sebagai Super Admin
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

## 🎯 Test Basic Features

### 1. Login Test
- Login dengan user yang sudah dibuat
- Pastikan redirect ke dashboard sesuai role

### 2. Navigation Test
- Test semua menu navigation
- Pastikan role-based access berfungsi

### 3. Input Absensi (Koordinator Desa)
- Set user role sebagai `koordinator_desa` dengan `desa_id`
- Test input absensi untuk kelompok

### 4. View Reports
- Test laporan dengan berbagai filter
- Test print functionality

## 🔧 Common Issues & Solutions

### Issue: "Supabase connection failed"
**Solution**: 
- Check environment variables
- Verify Supabase project is active
- Check network connection

### Issue: "RLS policy violation"
**Solution**:
- Ensure SQL schema executed completely
- Check user has proper role assigned
- Verify RLS policies are active

### Issue: "Build errors"
**Solution**:
```bash
# Check TypeScript errors
npm run type-check

# Check linting
npm run lint

# Clear cache and reinstall
rm -rf .next node_modules
npm install
```

### Issue: "Authentication not working"
**Solution**:
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## 📱 Mobile Testing

Test responsiveness:
- Chrome DevTools > Device Mode
- Test pada breakpoints: 320px, 768px, 1024px
- Pastikan navigation mobile berfungsi

## 🚀 Ready for Production?

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Test users created and roles assigned
- [ ] Basic functionality tested
- [ ] Mobile responsiveness verified
- [ ] Security headers configured

### Deploy to Vercel
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy!

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap.

## 📚 Next Steps

### Learn More
- [README.md](./README.md) - Dokumentasi lengkap
- [TESTING.md](./TESTING.md) - Testing guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

### Customize
- Modify colors di `tailwind.config.js`
- Add new features di `app/` directory
- Extend database schema di Supabase

### Get Help
- Check [Issues](link-to-issues) untuk common problems
- Contact support: support@asad.com

## 🎉 Success!

Jika semua langkah berhasil, Anda sekarang memiliki:
- ✅ Sistem absensi yang berfungsi
- ✅ Role-based authentication
- ✅ Dashboard untuk setiap role
- ✅ Input dan laporan absensi
- ✅ Responsive design

**Selamat! Sistem Absensi ASAD siap digunakan! 🚀**

---

**Tips**: Bookmark halaman ini untuk referensi cepat setup di masa depan.