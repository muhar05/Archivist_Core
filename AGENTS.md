# Agent Context: Physical Records Management System (PRMS)

## 1. Project Overview
Sistem manajemen pengarsipan laporan fisik untuk melacak lokasi dokumen secara presisi (Gudang > Lantai > Unit > Sub-unit/Loker). Fokus utama adalah sinkronisasi koordinat digital dengan keberadaan fisik melalui mekanisme "Request & Verification".

## 2. Directory Structure
Wajib mengikuti struktur folder berikut:
- `app/(auth)/`: Login & Authentication.
- `app/(dashboard)/admin/`: Fitur Arsitek, Approvals, & Inventory Audit.
- `app/(dashboard)/staff/`: Form Deposit, Loan, & History Request.
- `app/(dashboard)/location/[id]/`: Navigasi Denah & List Loker (Shared).
- `services/`: Logika bisnis & query Supabase (location, report, vector).
- `hooks/queries/`: Custom hooks untuk TanStack Query.
- `providers/`: QueryProvider & ThemeProvider.
- `middleware.ts`: Proteksi rute RBAC (Admin vs Staff).

## 3. User Roles & Authentication
- **Admin (Arsitek & Verifikator)**:
  - Mengatur layout ruangan (X, Y, Z coordinates).
  - Verifikasi fisik dokumen sebelum status menjadi 'ARCHIVED'.
  - Hak relokasi laporan jika slot fisik penuh.
- **Staff Biasa (Operator)**:
  - Request penempatan (Deposit) & Peminjaman (Loan).
  - Akses mandiri ke ruangan/loker, namun status 'PENDING' hingga diverifikasi Admin.
- **Security**: Implementasi RBAC pada tabel `profiles` (column: `role`). Proteksi rute `/admin` via Middleware.

## 4. Location & Architect Engine (X, Y, Z Logic)
- **Multi-Level Support**: Mendukung `floor_number` dalam satu ruangan.
- **Top View (X, Y)**: Grid-based canvas. Admin wajib menandai area "AKSES" (Tangga/Pintu).
- **Elevation View (Z-Axis)**: Manajemen tumpukan vertikal (lemari di atas lemari).
- **Infinite Nesting**: Struktur rekursif (`parent_id`). Unit terdalam ditandai `is_assignable = true`.

## 5. Workflow: Deposit & Loan
- **Deposit Flow**: Staff isi metadata + SOP Checklist + Estimasi Tebal -> Soft Lock Unit -> Admin Verifikasi Fisik -> Status 'ARCHIVED'.
- **Loan Flow**: Staff request + Due Date -> Admin Approve -> Status 'LOANED'. Alert Badge Merah jika Overdue.
- **Final Confirmation**: Mekanisme dua tahap (Admin Approval -> Staff Placement Confirmation) untuk sinkronisasi status fisik.

## 6. Technical Standards
- **Database**: Supabase (PostgreSQL) + RLS Aktif.
- **State Management**: TanStack Query (v5). Invalidate key 'reports' pada setiap aksi Deposit/Loan.
- **Sync Strategy**: Real-time subscriptions Supabase untuk update UI otomatis tanpa refresh.
- **Metadata Search**: Gunakan `pgvector` untuk pencarian semantik (makna kata) pada metadata (Judul, Klien, Tags). **Tidak menggunakan OCR**.

## 7. Capacity & Density Policy
- **No Hard Limits**: Tidak ada batasan jumlah digital karena ketebalan fisik bervariasi.
- **Density Status**: Flag manual (`Available`, `Low Space`, `Full`) oleh Admin/Staff berdasarkan kondisi fisik.
- **Locker View**: Unit terdalam menampilkan "Table List View" dengan aksi Deposit/Loan.

## 8. UI/UX: Nova Style & Responsive
- **Theme**: Dark Mode default (`slate-950`). Glassmorphism pada Navbar/Modal.
- **Mobile-First**: 
  - Sidebar menjadi Drawer di mobile.
  - Aksi tombol minimal 44px (touch-friendly).
  - Denah mendukung Pinch-to-Zoom atau Toggle "List View" pada layar kecil.
- **Feedback**: Scale effects (`scale-105`) dan status badges semantik (Hijau/Kuning/Merah).

## 9. Operational Guardrails & Security
- **Soft Deletion**: Larang hapus unit yang berisi sub-unit atau laporan aktif.
- **Circular Reference**: Cegah unit menjadi parent bagi dirinya sendiri.
- **Maintenance Mode**: Ruangan otomatis Read-only bagi Staff saat Admin mengedit layout grid.
- **Handover Logic**: Support pemindahan tangan antar Staff untuk barang dipinjam guna menjaga audit trail.
- **Semantic Privacy**: Hasil pencarian vector harus tetap menghormati RLS dan role user.

## 10. Advanced Logistics
- **Bulk Relocation**: Fitur pindah semua isi unit parent ke unit lain dalam satu transaksi.
- **Audit Mode**: Interface verifikasi fisik laporan terhadap list digital secara berkala.