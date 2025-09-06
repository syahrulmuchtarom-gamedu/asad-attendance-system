-- Insert koordinator desa users (skip yang sudah ada)
-- Password untuk semua: admin123

INSERT INTO users (username, password, full_name, role, desa_id) 
SELECT * FROM (
  VALUES 
  ('koordinator1', 'admin123', 'Koordinator Kapuk Melati', 'koordinator_desa', 1),
  ('koordinator2', 'admin123', 'Koordinator Jelambar', 'koordinator_desa', 2),
  ('koordinator3', 'admin123', 'Koordinator Cengkareng', 'koordinator_desa', 3),
  ('koordinator4', 'admin123', 'Koordinator Kebon Jahe', 'koordinator_desa', 4),
  ('koordinator5', 'admin123', 'Koordinator Bandara', 'koordinator_desa', 5),
  ('koordinator6', 'admin123', 'Koordinator Taman Kota', 'koordinator_desa', 6),
  ('koordinator7', 'admin123', 'Koordinator Kalideres', 'koordinator_desa', 7),
  ('koordinator8', 'admin123', 'Koordinator Cipondoh', 'koordinator_desa', 8),
  ('koordinator_daerah', 'admin123', 'Koordinator Daerah', 'koordinator_daerah', NULL)
) AS new_users(username, password, full_name, role, desa_id)
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE users.username = new_users.username
);