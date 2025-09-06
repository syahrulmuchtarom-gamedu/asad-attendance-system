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
ALTER TABLE public.absensi DROP CONSTRAINT IF EXISTS absensi_input_by_fkey;
ALTER TABLE public.absensi ADD CONSTRAINT absensi_input_by_fkey 
FOREIGN KEY (input_by) REFERENCES public.users(id);

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