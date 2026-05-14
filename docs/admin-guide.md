# Panduan Administrator — SiPakarPC

Panduan untuk administrator dalam mengelola sistem pakar.

---

## Akses Panel Admin

1. Klik tombol **"Admin"** di pojok kanan atas halaman utama
2. Masukkan **password admin** (dikonfigurasi di sistem)
3. Akan diarahkan ke Dashboard Admin

---

## Menu Admin

### 1. Dashboard
Menampilkan ringkasan statistik sistem:
- Total sesi diagnosa
- Rata-rata nilai CF
- Grafik tren penggunaan harian
- Distribusi kerusakan per komponen
- Distribusi tingkat keyakinan
- Riwayat 5 sesi terakhir

### 2. Riwayat Diagnosa
Melihat semua sesi diagnosa dengan:
- **Filter** berdasarkan komponen
- **Pencarian** berdasarkan diagnosis atau kode gejala
- **Expand** setiap baris untuk melihat detail gejala dan hasil
- **Export Excel** per sesi (tombol biru "Excel" di setiap baris)
- **Export Semua** (tombol hijau di atas)

#### Format Export Excel (5 Sheet)
| Sheet | Isi |
|---|---|
| 1. Informasi Diagnosa | ID, tanggal, hasil utama, persentase CF, formula yang digunakan |
| 2. Gejala Terpilih | Kode, nama gejala, tingkat keyakinan user |
| 3. Perhitungan CF | MB, MD, CF Pakar, CF User, CF Hasil per gejala + langkah combine |
| 4. Ranking Diagnosa | Ranking descending semua komponen + status |
| 5. Solusi & Saran | Solusi teknis dan saran penanganan per komponen |

### 3. Kelola Gejala
- **Tambah** gejala baru dengan kode, deskripsi, dan kategori
- **Edit** gejala yang sudah ada
- **Hapus** gejala (perhatikan: akan mempengaruhi rules KB yang terkait)

### 4. Kelola Komponen
- **Tambah** komponen hardware baru
- **Edit** nama dan deskripsi komponen
- **Hapus** komponen (perhatikan: akan mempengaruhi rules KB)

### 5. Basis Pengetahuan (Knowledge Base)
Mengelola relasi antara gejala dan komponen dengan nilai MB/MD:
- **MB (Measure of Belief)**: Tingkat keyakinan bahwa gejala mendukung hipotesis (0–1)
- **MD (Measure of Disbelief)**: Tingkat keyakinan bahwa gejala membantah hipotesis (0–1)
- **CF = MB − MD**: Nilai certainty factor pakar

> ⚠️ **Perhatian**: Perubahan nilai MB/MD akan langsung mempengaruhi hasil diagnosa baru.

---

## Best Practice

1. **Backup rutin** dengan export Excel sebelum mengubah KB
2. Nilai **MB selalu > MD** untuk relasi yang positif
3. Jangan hapus gejala yang masih dipakai dalam KB tanpa menghapus relasinya dulu
4. Gunakan **filter dan pencarian** untuk menemukan sesi spesifik di riwayat

---

## Keamanan

- Session admin tersimpan di `localStorage` browser
- Gunakan **Logout** saat selesai menggunakan panel admin di komputer bersama
- Password admin dikonfigurasi secara statis di kode (untuk keperluan akademik)
