-- Supabase Seed Data
-- Profiles (Matching NextAuth Mock)
INSERT INTO public.profiles (id, full_name, email, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin Archivist', 'admin@prms.local', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Staff Operator', 'staff@prms.local', 'staff')
ON CONFLICT (id) DO NOTHING;

-- Rooms
INSERT INTO public.rooms (id, name, floor_number, grid_width, grid_height, width_cm, height_cm, ceiling_height_cm, description)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Gudang Utama (A)', 1, 50, 50, 1500, 1000, 300, 'Gudang penyimpanan utama untuk arsip fisik laporan.')
ON CONFLICT (id) DO NOTHING;

-- Storage Units
INSERT INTO public.storage_units (id, room_id, name, x, y, z, width, height, depth, unit_type, is_assignable)
VALUES 
  ('b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Cabinet Alpha', 100, 100, 0, 120, 200, 45, 'CABINET', false),
  ('c3d4e5f6-a7b8-4c5d-8e9f-0a1b2c3d4e5f', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Cabinet Beta', 300, 100, 0, 120, 200, 45, 'CABINET', false),
  ('d4e5f6a7-b8c9-4d5e-8f9a-0b1c2d3e4f5a', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Main Entrance', 0, 450, 0, 100, 10, 0, 'DOOR', false)
ON CONFLICT (id) DO NOTHING;

-- Lockers
INSERT INTO public.lockers (id, cabinet_id, name, x, y, width, height, depth, is_assignable, status)
VALUES 
  ('e5f6a7b8-c9d0-4e5f-8a9b-0c1d2e3f4a5b', 'b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e', 'Drawer A-1', 0, 0, 60, 40, 45, true, 'available'),
  ('f6a7b8c9-d0e1-4f5a-8b9c-0d1e2f3a4b5c', 'b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e', 'Drawer A-2', 60, 0, 60, 40, 45, true, 'available'),
  ('a7b8c9d0-e1f2-4a5b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e', 'Drawer A-3', 0, 40, 120, 60, 45, true, 'available')
ON CONFLICT (id) DO NOTHING;

-- SOP Requirements
INSERT INTO public.sop_requirements (name, description)
VALUES 
  ('Sertifikat Keaslian', 'Pastikan dokumen memiliki stempel basah asli.'),
  ('Berita Acara Penyerahan', 'Dokumen bukti serah terima dari client.'),
  ('Foto Fisik Laporan', 'Lampirkan minimal 2 foto kondisi fisik laporan.');
