-- Supabase Schema for ASAD Attendance System
-- Run this in Supabase SQL Editor

-- Create tables
-- Desa table
CREATE TABLE IF NOT EXISTS public.desa (
  id SERIAL PRIMARY KEY,
  nama_desa TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kelompok table
CREATE TABLE IF NOT EXISTS public.kelompok (
  id SERIAL PRIMARY KEY,
  nama_kelompok TEXT NOT NULL,
  desa_id INTEGER REFERENCES public.desa(id) ON DELETE CASCADE,
  target_putra INTEGER DEFAULT 25,
  target_putri INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(nama_kelompok, desa_id)
);

-- Profiles table (extend Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('super_admin', 'koordinator_desa', 'koordinator_daerah', 'viewer')) NOT NULL,
  desa_id INTEGER REFERENCES public.desa(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Absensi table
CREATE TABLE IF NOT EXISTS public.absensi (
  id SERIAL PRIMARY KEY,
  kelompok_id INTEGER REFERENCES public.kelompok(id) ON DELETE CASCADE,
  bulan INTEGER CHECK (bulan >= 1 AND bulan <= 12) NOT NULL,
  tahun INTEGER CHECK (tahun >= 2020) NOT NULL,
  hadir_putra INTEGER DEFAULT 0,
  hadir_putri INTEGER DEFAULT 0,
  input_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kelompok_id, bulan, tahun)
);

-- Insert master data desa
INSERT INTO public.desa (nama_desa) VALUES 
('Kapuk Melati'),
('Jelambar'),
('Cengkareng'),
('Kebon Jahe'),
('Bandara'),
('Taman Kota'),
('Kalideres'),
('Cipondoh')
ON CONFLICT (nama_desa) DO NOTHING;

-- Insert master data kelompok
INSERT INTO public.kelompok (nama_kelompok, desa_id, target_putra) VALUES 
-- Kapuk Melati (id: 1)
('Melati A', 1, 25),
('Melati B', 1, 25),
('BGN', 1, 25),
-- Jelambar (id: 2)
('Indah', 2, 25),
('Damar', 2, 25),
('Jaya', 2, 25),
('Pejagalan', 2, 25),
-- Cengkareng (id: 3)
('Fajar A', 3, 25),
('Fajar B', 3, 25),
('Fajar C', 3, 25),
-- Kebon Jahe (id: 4)
('Kebon Jahe A', 4, 25),
('Kebon Jahe B', 4, 25),
('Garikas', 4, 25),
('Taniwan', 4, 25),
-- Bandara (id: 5)
('Rawel', 5, 25),
('Prima', 5, 25),
('Kamdur', 5, 25),
-- Taman Kota (id: 6)
('Rawa Buaya A', 6, 25),
('Rawa Buaya B', 6, 25),
('Taman Kota A', 6, 25),
('Taman Kota B', 6, 25),
-- Kalideres (id: 7)
('Tegal Alur A', 7, 25),
('Tegal Alur B', 7, 25),
('Prepedan A', 7, 25),
('Prepedan B', 7, 25),
('Kebon Kelapa', 7, 25),
-- Cipondoh (id: 8)
('Griya Permata', 8, 25),
('Semanan A', 8, 25),
('Semanan B', 8, 25),
('Pondok Bahar', 8, 25)
ON CONFLICT (nama_kelompok, desa_id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kelompok ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absensi ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admin can view all profiles" ON public.profiles 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- Desa policies (readable by all authenticated users)
CREATE POLICY "All authenticated can view desa" ON public.desa 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super admin can manage desa" ON public.desa 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Kelompok policies (readable by all authenticated users)
CREATE POLICY "All authenticated can view kelompok" ON public.kelompok 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super admin can manage kelompok" ON public.kelompok 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Absensi policies
CREATE POLICY "All authenticated can view absensi" ON public.absensi 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Koordinator desa can insert absensi for their desa" ON public.absensi 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    JOIN public.kelompok k ON k.desa_id = p.desa_id 
    WHERE p.id = auth.uid() AND k.id = kelompok_id AND p.role = 'koordinator_desa'
  )
);

CREATE POLICY "Koordinator desa can update absensi for their desa" ON public.absensi 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    JOIN public.kelompok k ON k.desa_id = p.desa_id 
    WHERE p.id = auth.uid() AND k.id = kelompok_id AND p.role = 'koordinator_desa'
  )
);

CREATE POLICY "Super admin can manage all absensi" ON public.absensi 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Functions for triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_absensi_updated_at
  BEFORE UPDATE ON public.absensi
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_desa_id ON public.profiles(desa_id);
CREATE INDEX IF NOT EXISTS idx_kelompok_desa_id ON public.kelompok(desa_id);
CREATE INDEX IF NOT EXISTS idx_absensi_kelompok_id ON public.absensi(kelompok_id);
CREATE INDEX IF NOT EXISTS idx_absensi_bulan_tahun ON public.absensi(bulan, tahun);
CREATE INDEX IF NOT EXISTS idx_absensi_input_by ON public.absensi(input_by);

-- Create a view for absensi with related data
CREATE OR REPLACE VIEW public.absensi_with_details AS
SELECT 
  a.*,
  k.nama_kelompok,
  k.target_putra,
  k.target_putri,
  d.nama_desa,
  p.full_name as input_by_name,
  p.email as input_by_email
FROM public.absensi a
JOIN public.kelompok k ON a.kelompok_id = k.id
JOIN public.desa d ON k.desa_id = d.id
LEFT JOIN public.profiles p ON a.input_by = p.id;

-- Grant permissions on the view
GRANT SELECT ON public.absensi_with_details TO authenticated;

-- Create function to get dashboard stats
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(
  target_bulan INTEGER DEFAULT NULL,
  target_tahun INTEGER DEFAULT NULL,
  target_desa_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
  total_desa BIGINT,
  total_kelompok BIGINT,
  total_target_putra BIGINT,
  total_target_putri BIGINT,
  total_hadir_putra BIGINT,
  total_hadir_putri BIGINT,
  persentase_putra NUMERIC,
  persentase_putri NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.desa) as total_desa,
    (SELECT COUNT(*) FROM public.kelompok 
     WHERE (target_desa_id IS NULL OR desa_id = target_desa_id)) as total_kelompok,
    COALESCE(SUM(k.target_putra), 0) as total_target_putra,
    COALESCE(SUM(k.target_putri), 0) as total_target_putri,
    COALESCE(SUM(a.hadir_putra), 0) as total_hadir_putra,
    COALESCE(SUM(a.hadir_putri), 0) as total_hadir_putri,
    CASE 
      WHEN SUM(k.target_putra) > 0 THEN 
        ROUND((SUM(a.hadir_putra)::NUMERIC / SUM(k.target_putra)) * 100, 2)
      ELSE 0 
    END as persentase_putra,
    CASE 
      WHEN SUM(k.target_putri) > 0 THEN 
        ROUND((SUM(a.hadir_putri)::NUMERIC / SUM(k.target_putri)) * 100, 2)
      ELSE 0 
    END as persentase_putri
  FROM public.kelompok k
  LEFT JOIN public.absensi a ON k.id = a.kelompok_id 
    AND (target_bulan IS NULL OR a.bulan = target_bulan)
    AND (target_tahun IS NULL OR a.tahun = target_tahun)
  WHERE (target_desa_id IS NULL OR k.desa_id = target_desa_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats TO authenticated;