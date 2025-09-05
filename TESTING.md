# Testing Guide - Sistem Absensi ASAD

## 🧪 Manual Testing Checklist

### Authentication Testing

#### Login Functionality
- [ ] Login dengan email dan password yang benar
- [ ] Login dengan email salah (error message muncul)
- [ ] Login dengan password salah (error message muncul)
- [ ] Login dengan email kosong (validation error)
- [ ] Login dengan password kosong (validation error)
- [ ] Redirect ke dashboard setelah login berhasil
- [ ] Remember login state setelah refresh browser

#### Logout Functionality
- [ ] Logout dari dashboard (redirect ke login)
- [ ] Session cleared setelah logout
- [ ] Tidak bisa akses protected routes setelah logout

### Role-Based Access Control

#### Super Admin
- [ ] Akses ke `/dashboard/super-admin`
- [ ] Tidak bisa akses route role lain
- [ ] Bisa lihat semua data
- [ ] Bisa manage users (jika fitur sudah ada)
- [ ] Bisa manage master data

#### Koordinator Desa
- [ ] Akses ke `/dashboard/koordinator-desa`
- [ ] Akses ke `/absensi` untuk input
- [ ] Hanya bisa input untuk desa sendiri
- [ ] Tidak bisa akses data desa lain
- [ ] Tidak bisa akses route admin

#### Koordinator Daerah
- [ ] Akses ke `/dashboard/koordinator-daerah`
- [ ] Akses ke `/laporan` (semua desa)
- [ ] Tidak bisa input absensi
- [ ] Bisa lihat semua data laporan

#### Viewer
- [ ] Akses ke `/dashboard/viewer`
- [ ] Akses ke `/laporan` (read-only)
- [ ] Tidak bisa input atau edit data
- [ ] Bisa print laporan

### Absensi Input Testing

#### Form Validation
- [ ] Pilih kelompok (required)
- [ ] Pilih bulan dan tahun (required)
- [ ] Input hadir putra (0-50, number only)
- [ ] Input hadir putri (0-50, number only)
- [ ] Error jika input negatif
- [ ] Error jika input lebih dari 50

#### Business Logic
- [ ] Tidak bisa input duplikat (kelompok + bulan + tahun sama)
- [ ] Target kelompok ditampilkan dengan benar
- [ ] Data tersimpan ke database
- [ ] Redirect/refresh setelah berhasil input
- [ ] Toast notification muncul

#### Data Integrity
- [ ] Data tersimpan dengan user ID yang benar
- [ ] Timestamp created_at dan updated_at benar
- [ ] Relasi kelompok_id valid
- [ ] Tidak ada data corrupt

### Dashboard Testing

#### Super Admin Dashboard
- [ ] Total desa ditampilkan benar
- [ ] Total kelompok ditampilkan benar
- [ ] Total users ditampilkan benar
- [ ] Persentase kehadiran dihitung benar
- [ ] Recent activity ditampilkan
- [ ] Loading states berfungsi

#### Koordinator Desa Dashboard
- [ ] Data desa yang benar ditampilkan
- [ ] Kelompok sudah input vs belum input
- [ ] Persentase kehadiran desa
- [ ] Link ke input absensi berfungsi
- [ ] Link ke laporan desa berfungsi

#### Koordinator Daerah Dashboard
- [ ] Overview semua desa
- [ ] Progress input per desa
- [ ] Persentase kehadiran per desa
- [ ] Link ke laporan lengkap

#### Viewer Dashboard
- [ ] Statistik umum ditampilkan
- [ ] Tren 3 bulan terakhir
- [ ] Link ke laporan berfungsi
- [ ] Informasi sistem akurat

### Laporan Testing

#### Filter Functionality
- [ ] Filter bulan berfungsi
- [ ] Filter tahun berfungsi
- [ ] Data berubah sesuai filter
- [ ] URL parameter terupdate

#### Data Display
- [ ] Tabel responsif di mobile
- [ ] Data per desa akurat
- [ ] Perhitungan persentase benar
- [ ] Total row dihitung dengan benar
- [ ] Color coding persentase (hijau/kuning/merah)

#### Export Features (jika sudah diimplementasi)
- [ ] Export PDF berfungsi
- [ ] Export Excel berfungsi
- [ ] Print layout rapi
- [ ] Data export sesuai filter

### UI/UX Testing

#### Responsive Design
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Navigation mobile berfungsi
- [ ] Touch targets cukup besar

#### Accessibility
- [ ] Keyboard navigation
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] High contrast readable
- [ ] Alt text untuk images

#### Performance
- [ ] Page load < 3 detik
- [ ] No layout shift
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] Efficient re-renders

### Error Handling

#### Network Errors
- [ ] Offline handling
- [ ] Slow connection handling
- [ ] Server error (500) handling
- [ ] Timeout handling
- [ ] Retry mechanisms

#### User Errors
- [ ] Form validation errors
- [ ] Permission denied errors
- [ ] Not found (404) errors
- [ ] Friendly error messages
- [ ] Error recovery options

### Security Testing

#### Input Security
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] File upload security (jika ada)

#### Authentication Security
- [ ] JWT token expiration
- [ ] Session management
- [ ] Password requirements
- [ ] Rate limiting login
- [ ] Secure headers

#### Authorization Security
- [ ] RLS policies enforced
- [ ] API endpoint protection
- [ ] Direct object reference prevention
- [ ] Privilege escalation prevention

## 🔧 Test Data Setup

### Create Test Users

```sql
-- Super Admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW());

INSERT INTO profiles (id, email, role, full_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin@test.com', 'super_admin', 'Test Admin');

-- Koordinator Desa
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('22222222-2222-2222-2222-222222222222', 'koordinator@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW());

INSERT INTO profiles (id, email, role, desa_id, full_name)
VALUES ('22222222-2222-2222-2222-222222222222', 'koordinator@test.com', 'koordinator_desa', 1, 'Test Koordinator');

-- Koordinator Daerah
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('33333333-3333-3333-3333-333333333333', 'daerah@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW());

INSERT INTO profiles (id, email, role, full_name)
VALUES ('33333333-3333-3333-3333-333333333333', 'daerah@test.com', 'koordinator_daerah', 'Test Koordinator Daerah');

-- Viewer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('44444444-4444-4444-4444-444444444444', 'viewer@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW());

INSERT INTO profiles (id, email, role, full_name)
VALUES ('44444444-4444-4444-4444-444444444444', 'viewer@test.com', 'viewer', 'Test Viewer');
```

### Create Test Absensi Data

```sql
-- Sample absensi data untuk testing
INSERT INTO absensi (kelompok_id, bulan, tahun, hadir_putra, hadir_putri, input_by) VALUES
(1, 11, 2024, 20, 0, '22222222-2222-2222-2222-222222222222'),
(2, 11, 2024, 18, 0, '22222222-2222-2222-2222-222222222222'),
(3, 11, 2024, 22, 0, '22222222-2222-2222-2222-222222222222'),
(4, 11, 2024, 15, 0, '22222222-2222-2222-2222-222222222222'),
(5, 11, 2024, 25, 0, '22222222-2222-2222-2222-222222222222');
```

## 🐛 Bug Report Template

```markdown
**Bug Title**: [Deskripsi singkat bug]

**Environment**:
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [Version number]
- OS: [Windows/Mac/Linux/Mobile]
- Screen Size: [Desktop/Tablet/Mobile]

**Steps to Reproduce**:
1. Login sebagai [role]
2. Navigate ke [page]
3. Click [button/element]
4. [Additional steps]

**Expected Result**:
[Apa yang seharusnya terjadi]

**Actual Result**:
[Apa yang benar-benar terjadi]

**Screenshots**:
[Attach screenshots jika ada]

**Console Errors**:
[Copy paste error dari browser console]

**Additional Notes**:
[Informasi tambahan yang relevan]
```

## 📊 Performance Testing

### Metrics to Monitor
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### Tools
- Google PageSpeed Insights
- Lighthouse CI
- Vercel Analytics
- Chrome DevTools

## 🔄 Regression Testing

### Before Each Release
- [ ] All authentication flows
- [ ] All role-based access
- [ ] Critical user journeys
- [ ] Data integrity checks
- [ ] Performance benchmarks
- [ ] Security validations

### Test Environments
- **Development**: Local development
- **Staging**: Vercel preview deployments
- **Production**: Live application

---

**Testing adalah kunci kesuksesan aplikasi yang reliable! 🧪✅**