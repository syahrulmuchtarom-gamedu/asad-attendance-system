-- ============================================
-- ABSENSI PENDERESAN ASAD - DATABASE SCHEMA
-- PostgreSQL / Supabase
-- Version: 1.2.0
-- Last Updated: 2025-01-11
-- ============================================

-- ============================================
-- 1. TABLE: desa (Master Data Desa)
-- ============================================
CREATE TABLE IF NOT EXISTS desa (
  id BIGSERIAL PRIMARY KEY,
  nama_desa VARCHAR(100) UNIQUE NOT NULL,
  kode_desa VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert 8 Desa
INSERT INTO desa (nama_desa, kode_desa) VALUES
('Kapuk Melati', 'KM'),
('Jelambar', 'JB'),
('Cengkareng', 'CK'),
('Kebon Jahe', 'KJ'),
('Bandara', 'BD'),
('Taman Kota', 'TK'),
('Kalideres', 'KD'),
('Cipondoh', 'CP')
ON CONFLICT (nama_desa) DO NOTHING;

-- ============================================
-- 2. TABLE: users (User Management)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'koordinator_desa', 'koordinator_daerah', 'viewer', 'astrida')),
  desa_id BIGINT REFERENCES desa(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_desa_id ON users(desa_id);

-- ============================================
-- 3. TABLE: kelompok (Master Data Kelompok)
-- ============================================
CREATE TABLE IF NOT EXISTS kelompok (
  id BIGSERIAL PRIMARY KEY,
  desa_id BIGINT NOT NULL REFERENCES desa(id) ON DELETE CASCADE,
  nama_kelompok VARCHAR(100) NOT NULL,
  target_putra INTEGER DEFAULT 25 CHECK (target_putra >= 0),
  target_putri INTEGER DEFAULT 25 CHECK (target_putri >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(desa_id, nama_kelompok)
);

CREATE INDEX IF NOT EXISTS idx_kelompok_desa_id ON kelompok(desa_id);

-- Insert 30 Kelompok
-- Kapuk Melati (3 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Kapuk Melati'), 'Melati A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kapuk Melati'), 'Melati B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kapuk Melati'), 'BGN', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Jelambar (4 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Jelambar'), 'Indah', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Jelambar'), 'Damar', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Jelambar'), 'Jaya', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Jelambar'), 'Pejagalan', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Cengkareng (3 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Cengkareng'), 'Fajar A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Cengkareng'), 'Fajar B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Cengkareng'), 'Fajar C', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Kebon Jahe (4 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Kebon Jahe'), 'Kebon Jahe A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kebon Jahe'), 'Kebon Jahe B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kebon Jahe'), 'Garikas', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kebon Jahe'), 'Taniwan', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Bandara (3 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Bandara'), 'Prima', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Bandara'), 'Rawa Lele', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Bandara'), 'Kampung Duri', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Taman Kota (4 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Taman Kota'), 'Rawa Buaya A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Taman Kota'), 'Rawa Buaya B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Taman Kota'), 'Taman Kota A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Taman Kota'), 'Taman Kota B', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Kalideres (5 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Kalideres'), 'Tegal Alur A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kalideres'), 'Tegal Alur B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kalideres'), 'Prepedan A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kalideres'), 'Prepedan B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kalideres'), 'Kebon Kelapa', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- Cipondoh (4 kelompok)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Cipondoh'), 'Griya Permata', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Cipondoh'), 'Semanan A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Cipondoh'), 'Semanan B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Cipondoh'), 'Pondok Bahar', 25, 25)
ON CONFLICT (desa_id, nama_kelompok) DO NOTHING;

-- ============================================
-- 4. TABLE: absensi (Data Kehadiran Bulanan)
-- ============================================
CREATE TABLE IF NOT EXISTS absensi (
  id BIGSERIAL PRIMARY KEY,
  kelompok_id BIGINT NOT NULL REFERENCES kelompok(id) ON DELETE CASCADE,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  tahun INTEGER NOT NULL CHECK (tahun >= 2024),
  hadir_putra INTEGER DEFAULT 0 CHECK (hadir_putra >= 0),
  hadir_putri INTEGER DEFAULT 0 CHECK (hadir_putri >= 0),
  input_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(kelompok_id, bulan, tahun)
);

CREATE INDEX IF NOT EXISTS idx_absensi_kelompok_id ON absensi(kelompok_id);
CREATE INDEX IF NOT EXISTS idx_absensi_bulan_tahun ON absensi(bulan, tahun);
CREATE INDEX IF NOT EXISTS idx_absensi_input_by ON absensi(input_by);

-- ============================================
-- 5. TABLE: settings (Application Settings)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('app_name', 'Absensi Penderesan ASAD', 'Nama aplikasi'),
('contact_email', 'support@asad.com', 'Email kontak'),
('contact_phone', '+62-xxx-xxxx-xxxx', 'Nomor telepon kontak'),
('default_target_putra', '25', 'Target default untuk putra per kelompok'),
('default_target_putri', '25', 'Target default untuk putri per kelompok')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- 6. INSERT TEST USERS
-- ============================================
-- IMPORTANT: Ganti password dengan hashed password di production!
-- Gunakan bcrypt atau argon2 untuk hashing

-- Super Admin
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('admin', 'admin123', 'Super Administrator', 'super_admin', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- Astrida User (akses input semua desa + laporan)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('astrida', 'astrida123', 'Astrida User', 'astrida', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- Koordinator Desa (harus punya desa_id yang valid)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('koordinator_kalideres', 'kalideres123', 'Koordinator Kalideres', 'koordinator_desa', 
 (SELECT id FROM desa WHERE nama_desa = 'Kalideres'), true),
('koordinator_bandara', 'bandara123', 'Koordinator Bandara', 'koordinator_desa', 
 (SELECT id FROM desa WHERE nama_desa = 'Bandara'), true)
ON CONFLICT (username) DO NOTHING;

-- Koordinator Daerah (view semua laporan)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('koordinator_daerah', 'daerah123', 'Koordinator Daerah', 'koordinator_daerah', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- Viewer (read-only)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('viewer', 'viewer123', 'Viewer User', 'viewer', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 7. USEFUL QUERIES
-- ============================================

-- View semua kelompok per desa
-- SELECT d.nama_desa, k.nama_kelompok, k.target_putra, k.target_putri
-- FROM kelompok k
-- JOIN desa d ON k.desa_id = d.id
-- ORDER BY d.nama_desa, k.nama_kelompok;

-- View absensi dengan detail kelompok dan desa
-- SELECT 
--   d.nama_desa,
--   k.nama_kelompok,
--   a.bulan,
--   a.tahun,
--   a.hadir_putra,
--   a.hadir_putri,
--   k.target_putra,
--   k.target_putri,
--   ROUND((a.hadir_putra::DECIMAL / k.target_putra * 100), 2) as persentase_putra,
--   ROUND((a.hadir_putri::DECIMAL / k.target_putri * 100), 2) as persentase_putri
-- FROM absensi a
-- JOIN kelompok k ON a.kelompok_id = k.id
-- JOIN desa d ON k.desa_id = d.id
-- ORDER BY a.tahun DESC, a.bulan DESC, d.nama_desa;

-- Laporan agregat per desa per bulan
-- SELECT 
--   d.nama_desa,
--   a.bulan,
--   a.tahun,
--   SUM(a.hadir_putra) as total_hadir_putra,
--   SUM(a.hadir_putri) as total_hadir_putri,
--   SUM(k.target_putra) as total_target_putra,
--   SUM(k.target_putri) as total_target_putri,
--   ROUND((SUM(a.hadir_putra)::DECIMAL / SUM(k.target_putra) * 100), 2) as persentase_putra,
--   ROUND((SUM(a.hadir_putri)::DECIMAL / SUM(k.target_putri) * 100), 2) as persentase_putri
-- FROM absensi a
-- JOIN kelompok k ON a.kelompok_id = k.id
-- JOIN desa d ON k.desa_id = d.id
-- GROUP BY d.nama_desa, a.bulan, a.tahun
-- ORDER BY a.tahun DESC, a.bulan DESC, d.nama_desa;

-- Check users tanpa desa_id yang seharusnya punya
-- SELECT username, full_name, role, desa_id 
-- FROM users 
-- WHERE role = 'koordinator_desa' AND desa_id IS NULL;

-- ============================================
-- 8. MAINTENANCE QUERIES
-- ============================================

-- Update timestamp trigger (optional, untuk auto-update updated_at)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.updated_at = NOW();
--    RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
-- FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_desa_updated_at BEFORE UPDATE ON desa
-- FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_kelompok_updated_at BEFORE UPDATE ON kelompok
-- FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_absensi_updated_at BEFORE UPDATE ON absensi
-- FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
-- FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- END OF SCHEMA
-- ============================================
