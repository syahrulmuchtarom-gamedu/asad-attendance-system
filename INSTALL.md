# Instalasi Master Data Features

## 1. Install Dependencies Baru

```bash
npm install @supabase/auth-helpers-nextjs@^0.8.7
```

## 2. Setup Database

1. Buka Supabase Dashboard
2. Jalankan SQL dari file `supabase-schema.sql`
3. Pastikan RLS (Row Level Security) aktif

## 3. Environment Variables

Pastikan file `.env.local` memiliki:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Fitur Master Data yang Ditambahkan

### ✅ API Endpoints
- `GET /api/desa` - Ambil semua desa dengan jumlah kelompok
- `POST /api/desa` - Tambah desa baru
- `PUT /api/desa` - Update desa
- `DELETE /api/desa?id=X` - Hapus desa

- `GET /api/kelompok` - Ambil semua kelompok dengan info desa
- `POST /api/kelompok` - Tambah kelompok baru
- `PUT /api/kelompok` - Update kelompok
- `DELETE /api/kelompok?id=X` - Hapus kelompok

### ✅ UI Components
- Modal form untuk tambah/edit desa
- Modal form untuk tambah/edit kelompok
- Tombol delete dengan konfirmasi
- Toast notifications untuk feedback
- Loading states
- Form validation

### ✅ Database Features
- Tabel `desa` dan `kelompok` dengan relasi
- Auto-count kelompok per desa
- Unique constraints
- Timestamps otomatis
- RLS policies

## 5. Cara Menggunakan

1. Login sebagai Super Admin
2. Buka menu "Master Data"
3. Klik "Tambah" untuk menambah desa/kelompok
4. Klik icon Edit untuk mengubah data
5. Klik icon Trash untuk menghapus data

## 6. Validasi

- Nama desa harus unik
- Nama kelompok harus unik per desa
- Target putra minimal 1
- Konfirmasi sebelum delete
- Error handling untuk semua operasi

## 7. Testing

Test semua fungsi CRUD:
- ✅ Create desa/kelompok
- ✅ Read data dengan pagination
- ✅ Update data existing
- ✅ Delete dengan konfirmasi
- ✅ Validasi form
- ✅ Error handling
- ✅ Toast notifications