# Panduan Deployment Sistem Absensi ASAD

## 🚀 Deployment ke Vercel

### Prerequisites
- Akun GitHub
- Akun Vercel
- Akun Supabase
- Repository sudah di-push ke GitHub

### Step 1: Setup Supabase Database

1. **Buat Project Supabase Baru**
   - Login ke [supabase.com](https://supabase.com)
   - Klik "New Project"
   - Pilih organization dan beri nama project
   - Set password database yang kuat
   - Pilih region terdekat (Singapore untuk Indonesia)

2. **Jalankan SQL Schema**
   - Buka SQL Editor di Supabase Dashboard
   - Copy paste isi file `supabase-schema.sql`
   - Klik "Run" untuk execute semua SQL commands
   - Pastikan semua tabel berhasil dibuat

3. **Konfigurasi Authentication**
   - Buka Authentication > Settings
   - Set "Site URL" ke domain production Anda
   - Tambahkan redirect URLs jika diperlukan
   - Enable email confirmation jika diinginkan

4. **Setup RLS (Row Level Security)**
   - Pastikan RLS sudah enabled untuk semua tabel
   - Test policies dengan user test

### Step 2: Deploy ke Vercel

1. **Connect Repository**
   - Login ke [vercel.com](https://vercel.com)
   - Klik "New Project"
   - Import repository dari GitHub
   - Pilih repository sistem absensi

2. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXTAUTH_SECRET=your-random-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai
   - Test deployment di URL yang diberikan

### Step 3: Setup Domain (Opsional)

1. **Custom Domain**
   - Buka project settings di Vercel
   - Tambahkan custom domain
   - Update DNS records sesuai instruksi
   - Update `NEXTAUTH_URL` environment variable

### Step 4: Create Initial Users

1. **Super Admin User**
   ```sql
   -- Daftarkan user melalui aplikasi terlebih dahulu
   -- Kemudian update role di database
   UPDATE profiles 
   SET role = 'super_admin' 
   WHERE email = 'admin@yourdomain.com';
   ```

2. **Test Users untuk Development**
   ```sql
   -- Koordinator Desa
   INSERT INTO profiles (id, email, role, desa_id, full_name) VALUES 
   ('uuid-koordinator-1', 'koordinator.kapukmelati@asad.com', 'koordinator_desa', 1, 'Koordinator Kapuk Melati');
   
   -- Koordinator Daerah
   INSERT INTO profiles (id, email, role, full_name) VALUES 
   ('uuid-koordinator-daerah', 'koordinator.daerah@asad.com', 'koordinator_daerah', 'Koordinator Daerah');
   
   -- Viewer
   INSERT INTO profiles (id, email, role, full_name) VALUES 
   ('uuid-viewer', 'viewer@asad.com', 'viewer', 'Viewer ASAD');
   ```

## 🔧 Configuration Checklist

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - URL project Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key dari Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (rahasia!)
- [ ] `NEXTAUTH_SECRET` - Random string untuk JWT signing
- [ ] `NEXTAUTH_URL` - URL production aplikasi

### Database Setup
- [ ] Semua tabel berhasil dibuat
- [ ] Master data desa dan kelompok sudah diinsert
- [ ] RLS policies aktif dan berfungsi
- [ ] Triggers dan functions berjalan normal
- [ ] Indexes sudah dibuat untuk performance

### Application Testing
- [ ] Login/logout berfungsi
- [ ] Role-based access control bekerja
- [ ] Input absensi berhasil
- [ ] Laporan dapat diakses
- [ ] Export functionality (jika sudah diimplementasi)
- [ ] Mobile responsiveness
- [ ] Print layouts

## 🔒 Security Checklist

### Supabase Security
- [ ] RLS enabled untuk semua tabel
- [ ] Service role key tidak exposed di client
- [ ] Database password yang kuat
- [ ] API rate limiting configured

### Application Security
- [ ] Input validation di client dan server
- [ ] CSRF protection aktif
- [ ] Secure headers configured
- [ ] No sensitive data di logs
- [ ] Environment variables secure

## 📊 Monitoring & Maintenance

### Vercel Analytics
- Enable Vercel Analytics untuk monitoring performance
- Setup alerts untuk errors dan downtime

### Database Monitoring
- Monitor Supabase dashboard untuk:
  - Database usage
  - API requests
  - Authentication metrics
  - Error logs

### Regular Maintenance
- [ ] Backup database secara berkala
- [ ] Update dependencies
- [ ] Monitor error logs
- [ ] Performance optimization
- [ ] Security updates

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Check TypeScript errors
   npm run type-check
   
   # Check linting
   npm run lint
   ```

2. **Database Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Test connection dari local

3. **Authentication Problems**
   - Check redirect URLs
   - Verify JWT secret
   - Test with different browsers

4. **Permission Errors**
   - Verify RLS policies
   - Check user roles in database
   - Test with different user types

### Support Contacts
- **Technical Issues**: tech@asad.com
- **Database Issues**: db@asad.com
- **General Support**: support@asad.com

## 📈 Performance Optimization

### Recommended Settings
- Enable Vercel Edge Functions untuk API routes
- Configure CDN untuk static assets
- Implement database connection pooling
- Use Vercel Image Optimization

### Monitoring Tools
- Vercel Analytics
- Supabase Dashboard
- Google PageSpeed Insights
- Lighthouse CI

---

**Deployment berhasil? Selamat! 🎉**

Sistem Absensi ASAD siap digunakan untuk mendukung kegiatan organisasi.