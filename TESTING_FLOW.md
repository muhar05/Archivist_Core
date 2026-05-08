# Panduan Testing Alur Archivist Core (PRMS)

Dokumen ini menjelaskan langkah-langkah pengujian fitur utama berdasarkan peran pengguna (Role) untuk memastikan sinkronisasi antara data digital dan keberadaan fisik dokumen.

---

## 1. Peran: Admin (Arsitek & Verifikator)
**Tujuan**: Mengelola tata letak gudang dan memverifikasi laporan fisik.

### A. Pengaturan Denah Gudang
1.  **Login** sebagai Admin.
2.  Masuk ke menu **Warehouse / Architect**.
3.  **Buat Ruangan Baru**: Tentukan nama dan dimensi (cm).
4.  **Desain Tata Letak**: Masuk ke ruangan, tambahkan elemen seperti Lemari (Cabinet), Pintu, atau Tangga.
5.  **Manajemen Loker**: Klik pada Lemari, masuk ke tampilan elevasi, dan tambahkan Unit/Loker. Pastikan centang opsi `Is Assignable` agar loker bisa digunakan untuk menyimpan dokumen.

### B. Verifikasi Laporan (Deposit Approval)
1.  Masuk ke menu **Approvals**.
2.  Cari laporan baru dari Staff yang berstatus `PENDING`.
3.  **Verifikasi**: Klik tombol verifikasi setelah memastikan fisik dokumen benar-benar ada.
4.  Status akan berubah menjadi `PENDING_PLACEMENT` (Menunggu Staff menaruh dokumen ke koordinat yang tepat).

---

## 2. Peran: Staff (Operator)
**Tujuan**: Melakukan penyimpanan (Deposit), Peminjaman (Loan), dan Pengembalian (Return).

### A. Alur Penyimpanan (Taro Laporan)
1.  **Login** sebagai Staff.
2.  Masuk ke menu **Warehouse**.
3.  **Cari Lokasi**: Navigasi melalui denah (Ruangan → Lemari → Loker).
4.  **Taro Laporan**: Klik tombol "Taro Laporan" pada loker yang diinginkan.
5.  **Isi Data**: 
    *   Pilih **Kategori Laporan** (Judul & Kode akan terisi otomatis).
    *   Lengkapi metadata lainnya.
6.  **Simpan**: Status awal adalah `PENDING`. Laporan ini sekarang menunggu verifikasi Admin.

### B. Konfirmasi Penempatan (Finalisasi)
1.  Setelah Admin memverifikasi (Status: `PENDING_PLACEMENT`), Staff harus kembali ke Loker tersebut.
2.  Klik tombol **Konfirmasi Penempatan** untuk memastikan dokumen sudah diletakkan di rak secara fisik.
3.  Status berubah menjadi **ARCHIVED** (Hijau).

### C. Alur Peminjaman (Loan)
1.  Cari laporan berstatus **ARCHIVED** di dalam loker atau melalui menu **Records**.
2.  Klik tombol **Pinjam**.
3.  Tentukan tanggal estimasi pengembalian.
4.  Status berubah menjadi **BORROWED** (Biru).

### D. Alur Pengembalian (Return)
1.  Masuk ke menu **Loans** atau navigasi ke loker asal dokumen.
2.  Klik tombol **Kembalikan**.
3.  Status akan kembali menjadi **ARCHIVED**.

---

## 3. Pengujian Master Data & Audit
1.  **Halaman Records**: Pastikan semua data muncul dengan badge status yang benar (Archived/Borrowed/Pending).
2.  **Filter & Search**: Tes pencarian berdasarkan Judul atau Kode unik, serta filter berdasarkan Kategori.
3.  **Export CSV**: Pastikan data yang difilter dapat diunduh dalam format CSV untuk kebutuhan audit fisik.
