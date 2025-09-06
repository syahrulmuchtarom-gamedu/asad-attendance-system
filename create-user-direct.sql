-- Alternatif: Buat user langsung via SQL (gunakan dengan hati-hati)
-- Jalankan satu per satu

-- 1. Buat Super Admin
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@asad.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Super Admin"}',
  false,
  'authenticated'
);

-- 2. Cek user yang baru dibuat
SELECT id, email FROM auth.users WHERE email = 'admin@asad.com';

-- 3. Insert ke profiles (ganti UUID dengan hasil query di atas)
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES 
-- ('UUID-DARI-HASIL-QUERY', 'admin@asad.com', 'Super Admin', 'super_admin');