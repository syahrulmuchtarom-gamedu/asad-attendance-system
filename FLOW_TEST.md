# 🧪 FLOW TEST LENGKAP - LOGIN TO INPUT ABSENSI

## 📋 TEST CHECKLIST

### 1. LOGIN FLOW
- [ ] Buka `/login`
- [ ] Input username: `admin` password: `admin123` (super_admin)
- [ ] Input username: `koordinator_kalideres` password: `kalideres123` (koordinator_desa)
- [ ] Cek console log: "Login successful for user: xxx"
- [ ] Cek cookie ter-set dengan benar
- [ ] Redirect ke `/dashboard`

### 2. DASHBOARD REDIRECT
- [ ] Super Admin → `/dashboard/super-admin`
- [ ] Koordinator Desa → `/dashboard/koordinator-desa`
- [ ] Sidebar menu "Input Absensi" muncul

### 3. INPUT ABSENSI ACCESS
- [ ] Klik "Input Absensi" di sidebar
- [ ] Tidak ada redirect loop
- [ ] Halaman `/absensi` ter-load dengan benar

### 4. SUPER ADMIN FLOW
- [ ] Melihat daftar 8 desa
- [ ] Klik "Kalideres" → Form kelompok Kalideres (5 kelompok)
- [ ] Input data → Tombol "Simpan Data" aktif
- [ ] Submit berhasil → Kembali ke daftar desa

### 5. KOORDINATOR DESA FLOW  
- [ ] Langsung melihat form kelompok desanya
- [ ] Tombol "Simpan Data" aktif (tidak disable)
- [ ] Submit berhasil

## 🚨 MASALAH YANG MUNGKIN TERJADI

### A. LOGIN GAGAL
- Cek database: user ada dan aktif?
- Cek password match?
- Cek console log API login

### B. REDIRECT LOOP
- Cek middleware.ts
- Cek layout absensi
- Cek cookie format

### C. TOMBOL DISABLE
- Cek kelompokList.length > 0
- Cek dataStatus !== 'loading'
- Cek loading state

### D. DAFTAR DESA TIDAK MUNCUL
- Cek userRole === 'super_admin'
- Cek showDesaList === true
- Cek isClient === true

## 🔧 DEBUG COMMANDS

```sql
-- Cek user di database
SELECT * FROM users WHERE username IN ('admin', 'koordinator_kalideres');

-- Cek kelompok per desa
SELECT d.nama_desa, COUNT(k.id) as jumlah_kelompok
FROM desa d
LEFT JOIN kelompok k ON d.id = k.desa_id
GROUP BY d.id, d.nama_desa
ORDER BY d.nama_desa;
```

## 📝 EXPECTED RESULTS

### Super Admin Login:
1. Login → Dashboard Super Admin
2. Klik Input Absensi → Daftar 8 desa
3. Klik Kalideres → 5 kelompok Kalideres
4. Input data → Simpan berhasil

### Koordinator Desa Login:
1. Login → Dashboard Koordinator Desa  
2. Klik Input Absensi → Form kelompok desanya
3. Input data → Simpan berhasil

## ✅ SUCCESS CRITERIA
- [ ] Tidak ada redirect loop
- [ ] Cookie ter-set dengan benar
- [ ] Role-based access berfungsi
- [ ] Input data berhasil untuk kedua role