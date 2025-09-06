-- 1. Cek apakah trigger berfungsi
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- 2. Disable trigger sementara untuk testing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Buat user manual (jalankan satu per satu)
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
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@asad.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyz',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Super Admin"}',
  'authenticated',
  'authenticated'
);

-- 4. Cek user yang dibuat
SELECT id, email FROM auth.users WHERE email = 'admin@asad.com';

-- 5. Manual insert ke profiles (ganti UUID)
INSERT INTO public.profiles (id, email, full_name, role) 
SELECT id, email, 'Super Admin', 'super_admin' 
FROM auth.users WHERE email = 'admin@asad.com';

-- 6. Restore trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();