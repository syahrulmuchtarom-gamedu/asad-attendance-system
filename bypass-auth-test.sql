-- BYPASS untuk testing - buat profile dengan UUID dummy
-- HANYA untuk testing, bukan untuk production

-- 1. Disable RLS sementara
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Insert test profiles
INSERT INTO public.profiles (id, email, full_name, role) VALUES 
(gen_random_uuid(), 'admin@asad.com', 'Super Admin', 'super_admin'),
(gen_random_uuid(), 'koordinator@kapukmelati.com', 'Koordinator Kapuk Melati', 'koordinator_desa'),
(gen_random_uuid(), 'viewer@asad.com', 'Viewer User', 'viewer');

-- 3. Cek profiles yang dibuat
SELECT * FROM public.profiles;

-- 4. Enable RLS kembali setelah testing
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;