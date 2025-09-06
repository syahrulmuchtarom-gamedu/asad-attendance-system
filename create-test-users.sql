-- CARA YANG BENAR: Buat user melalui Supabase Dashboard dulu
-- 1. Buka Supabase Dashboard > Authentication > Users
-- 2. Klik "Create User" dan buat:
--    Email: admin@asad.com, Password: admin123
--    Email: koordinator@kapukmelati.com, Password: koordinator123  
--    Email: viewer@asad.com, Password: viewer123

-- 3. Cek UUID users yang sudah dibuat
SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- 4. Ganti UUID di bawah dengan UUID ASLI dari hasil query di atas
-- JANGAN jalankan INSERT sebelum mengganti UUID!

-- Contoh: Ganti dengan UUID asli
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES 
-- ('UUID-DARI-AUTH-USERS', 'admin@asad.com', 'Super Admin', 'super_admin');

-- INSERT INTO public.profiles (id, email, full_name, role, desa_id) VALUES 
-- ('UUID-DARI-AUTH-USERS', 'koordinator@kapukmelati.com', 'Koordinator Kapuk Melati', 'koordinator_desa', 1);

-- INSERT INTO public.profiles (id, email, full_name, role) VALUES 
-- ('UUID-DARI-AUTH-USERS', 'viewer@asad.com', 'Viewer User', 'viewer');

-- PENTING: UUID harus sama dengan yang ada di auth.users table