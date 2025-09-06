-- Schema baru dengan authentication sederhana
-- Hapus dependency ke Supabase Auth

-- 1. Buat tabel users sederhana
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('super_admin', 'koordinator_desa', 'koordinator_daerah', 'viewer')) NOT NULL,
  desa_id INTEGER REFERENCES public.desa(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert test users
INSERT INTO public.users (username, password, full_name, role, desa_id) VALUES 
('admin', 'admin123', 'Super Admin', 'super_admin', NULL),
('koordinator', 'koordinator123', 'Koordinator Kapuk Melati', 'koordinator_desa', 1),
('viewer', 'viewer123', 'Viewer User', 'viewer', NULL);

-- 3. Update tabel absensi untuk reference ke users baru
-- Hapus view yang bergantung pada kolom input_by
DROP VIEW IF EXISTS public.absensi_with_details;

-- Hapus constraint lama
ALTER TABLE public.absensi DROP CONSTRAINT IF EXISTS absensi_input_by_fkey;

-- Ubah tipe kolom input_by dari UUID ke INTEGER
ALTER TABLE public.absensi ALTER COLUMN input_by TYPE INTEGER USING NULL;

-- Tambah foreign key constraint baru
ALTER TABLE public.absensi ADD CONSTRAINT absensi_input_by_fkey 
FOREIGN KEY (input_by) REFERENCES public.users(id);

-- Buat ulang view dengan reference ke tabel users
CREATE OR REPLACE VIEW public.absensi_with_details AS
SELECT 
  a.*,
  k.nama_kelompok,
  k.target_putra,
  k.target_putri,
  d.nama_desa,
  u.full_name as input_by_name,
  u.username as input_by_username
FROM public.absensi a
JOIN public.kelompok k ON a.kelompok_id = k.id
JOIN public.desa d ON k.desa_id = d.id
LEFT JOIN public.users u ON a.input_by = u.id;

-- Grant permissions pada view
GRANT SELECT ON public.absensi_with_details TO authenticated;

-- 4. Hapus tabel profiles lama (opsional)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 5. Enable RLS untuk users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies untuk users
CREATE POLICY "Users can view own data" ON public.users 
FOR SELECT USING (id = current_setting('app.current_user_id')::integer);

CREATE POLICY "Super admin can view all users" ON public.users 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = current_setting('app.current_user_id')::integer AND role = 'super_admin')
);

-- 7. Update absensi policies
DROP POLICY IF EXISTS "Koordinator desa can insert absensi for their desa" ON public.absensi;
DROP POLICY IF EXISTS "Koordinator desa can update absensi for their desa" ON public.absensi;

CREATE POLICY "Koordinator desa can insert absensi for their desa" ON public.absensi 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.kelompok k ON k.desa_id = u.desa_id 
    WHERE u.id = current_setting('app.current_user_id')::integer 
    AND k.id = kelompok_id AND u.role = 'koordinator_desa'
  )
);

CREATE POLICY "Koordinator desa can update absensi for their desa" ON public.absensi 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.kelompok k ON k.desa_id = u.desa_id 
    WHERE u.id = current_setting('app.current_user_id')::integer 
    AND k.id = kelompok_id AND u.role = 'koordinator_desa'
  )
);

-- 8. Cek data users
SELECT * FROM public.users;