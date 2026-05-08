# The Archivist: Physical Records Management System (PRMS)

**The Archivist** adalah sistem manajemen pengarsipan laporan fisik canggih yang dirancang untuk melacak lokasi dokumen secara presisi di dalam gudang (Gudang > Lantai > Unit > Sub-unit/Loker). Sistem ini mengintegrasikan koordinat digital dengan keberadaan fisik melalui mekanisme "Request & Verification".

---

## 🚀 Fitur Utama

### 1. Architect Engine (X, Y, Z Logic)
- **Top View (X, Y)**: Navigasi berbasis grid untuk memetakan tata letak ruangan.
- **Elevation View (Z-Axis)**: Manajemen tumpukan vertikal (misal: rak di dalam lemari).
- **Multi-Level Support**: Mendukung pengelolaan lantai dalam satu gedung.
- **Infinite Nesting**: Struktur unit rekursif (Ruangan -> Rak -> Lemari -> Loker).

### 2. Workflow Manajemen Dokumen
- **Deposit Flow**: Pengajuan penyimpanan oleh Staff -> Verifikasi fisik oleh Admin -> Status 'ARCHIVED'.
- **Loan Flow**: Permintaan peminjaman -> Persetujuan Admin -> Pelacakan tanggal jatuh tempo dengan notifikasi visual.
- **Bulk Relocation**: Fitur pemindahan seluruh isi unit ke lokasi lain dalam satu transaksi.

### 3. Keamanan & Peran (RBAC)
- **Admin**: Arsitek tata letak, verifikator dokumen, dan pengelola pengguna.
- **Staff**: Operator yang melakukan input metadata, permintaan penyimpanan, dan peminjaman.
- **RLS (Row Level Security)**: Keamanan data tingkat database menggunakan Supabase.

### 4. Pencarian Canggih
- **Semantic Search**: Menggunakan `pgvector` untuk mencari dokumen berdasarkan makna kata (bukan sekadar kata kunci) pada judul dan deskripsi.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan estetika **Nova Style** (Dark Mode default, Glassmorphism).
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentikasi**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)

---

## 📂 Struktur Proyek

```text
app/
├── (auth)/          # Login & Registrasi
├── (dashboard)/     # Panel Utama (Admin & Staff)
├── api/             # API Routes & Auth
services/            # Logika Bisnis & Query Database
db/                  # Schema & Migrasi Drizzle
components/          # Komponen UI Reusable
hooks/               # Custom React Hooks (TanStack Query)
types/               # Definisi Type TypeScript
```

---

## ⚙️ Persiapan Lokal

1.  **Clone repositori**:
    ```bash
    git clone https://github.com/muhar05/Archivist_Core.git
    cd archivist-core
    ```

2.  **Instal dependensi**:
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**:
    Buat file `.env.local` dan isi sesuai dengan kredensial Supabase dan NextAuth Anda:
    ```env
    DATABASE_URL=
    NEXTAUTH_SECRET=
    NEXTAUTH_URL=http://localhost:3000
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    ```

4.  **Jalankan aplikasi**:
    ```bash
    npm run dev
    ```

---

## 🧪 Panduan Testing
Untuk detail langkah-langkah pengujian per role, silakan merujuk pada file [TESTING_FLOW.md](./TESTING_FLOW.md).

---

## 📄 Lisensi
Proyek ini dikembangkan untuk kebutuhan manajemen arsip fisik internal.
