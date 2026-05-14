# Panduan Export Excel — SiPakarPC

Panduan lengkap penggunaan fitur export laporan diagnosa ke Excel.

---

## Fitur Export

SiPakarPC menyediakan dua jenis export:

| Fitur | File Output | Deskripsi |
|---|---|---|
| **Export Semua** | `history-diagnosa.xlsx` | Ringkasan seluruh riwayat dalam satu sheet |
| **Export Per Sesi** | `detail-diagnosa-{ID}.xlsx` | Workbook 5 sheet dengan detail CF akademik |

---

## Export Semua Riwayat

**Lokasi:** Admin → Riwayat → Tombol hijau **"Ekspor Semua (N)"**

**Kolom yang tersedia:**

| Kolom | Deskripsi |
|---|---|
| No. | Nomor urut |
| ID Diagnosa | 8 karakter pertama UUID |
| Tanggal | Format tanggal lengkap Indonesia |
| Hasil Diagnosa | Komponen utama yang terdiagnosis |
| Persentase Keyakinan | Nilai CF dalam persen (color-coded) |
| Jumlah Gejala | Banyak gejala yang dipilih |
| Metode | "Certainty Factor" |

**Styling:**
- Header biru dengan teks putih bold
- Baris bergantian warna (alternating rows)
- Persentase berwarna sesuai kategori (hijau/biru/kuning)
- Auto column width

---

## Export Detail Per Sesi (5 Sheet)

**Lokasi:** Admin → Riwayat → Tombol biru **"Excel"** di setiap baris

### Sheet 1 — Informasi Diagnosa

Berisi metadata lengkap sesi:
- ID Diagnosa, Tanggal
- Hasil Utama, Persentase Keyakinan
- Formula CF yang digunakan
- Jumlah gejala dan komponen yang dianalisis

*Format:* Label bold dengan latar warna, merged title "SISTEM PAKAR DIAGNOSA KERUSAKAN PC"

---

### Sheet 2 — Gejala Terpilih

Tabel gejala yang dipilih pengguna:

| Kolom | Deskripsi |
|---|---|
| No. | Nomor urut |
| Kode Gejala | E01–E28 |
| Nama Gejala | Deskripsi lengkap gejala |
| Keyakinan User | Persentase keyakinan yang dipilih |

---

### Sheet 3 — Perhitungan CF ⭐ (Penting untuk Sidang)

Sheet paling detail — menampilkan **transparansi penuh** perhitungan:

**Bagian A — Per Gejala:**

| Kolom | Formula |
|---|---|
| MB | Measure of Belief dari KB |
| MD | Measure of Disbelief dari KB |
| CF Pakar | MB − MD |
| CF User | Keyakinan pengguna (0–1) |
| CF Hasil | CF User × CF Pakar |

**Bagian B — Proses Combine:**

| Kolom | Deskripsi |
|---|---|
| Langkah | Urutan kombinasi |
| Gejala | Kode gejala yang dikombinasikan |
| CF Lama | Nilai CF sebelum kombinasi |
| CF Baru | CF gejala baru yang ditambahkan |
| CF Combine | CF_old + CF_new × (1 − CF_old) |

**Hasil akhir** ditampilkan dengan warna biru bold di baris terakhir setiap komponen.

---

### Sheet 4 — Ranking Hasil Diagnosa

| Kolom | Deskripsi |
|---|---|
| Ranking | Urutan dari CF tertinggi |
| Jenis Kerusakan | Nama komponen |
| Nilai CF (Desimal) | Nilai 0–1 dengan 4 desimal |
| Persentase | Nilai dalam persen |
| Status | Tinggi / Sedang / Rendah |

- Baris ranking 1 di-highlight kuning
- Status berwarna sesuai kategori

---

### Sheet 5 — Solusi & Saran

| Kolom | Deskripsi |
|---|---|
| Jenis Kerusakan | Komponen yang terdiagnosis |
| Solusi | Langkah penanganan teknis |
| Saran Penanganan | Rekomendasi jangka panjang |

---

## Tips Penggunaan untuk Sidang/Presentasi

1. **Export per sesi** untuk satu contoh kasus → gunakan Sheet 3 untuk menjelaskan perhitungan
2. **Export semua** untuk menunjukkan keseluruhan data uji → ringkasan statistik
3. Sheet 3 sangat berguna untuk **membuktikan kebenaran formula CF** kepada dosen penguji
4. Nama file otomatis menyertakan ID diagnosa → mudah diidentifikasi

---

## Library yang Digunakan

- **ExcelJS** — rendering Excel dengan styling penuh (fill, font, border, merge)
- **FileSaver.js** — trigger download dari browser
