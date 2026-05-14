# Panduan Penggunaan — SiPakarPC

Panduan lengkap untuk pengguna akhir sistem pakar diagnosa kerusakan PC.

---

## 1. Halaman Utama

Saat membuka aplikasi, Anda akan disambut halaman utama dengan tombol:

- **Mulai Diagnosa** — memulai sesi diagnosa baru
- **Admin** — masuk ke panel administrator (memerlukan password)

---

## 2. Halaman Diagnosa

### Langkah-langkah

1. **Pilih Gejala** yang sesuai dengan kondisi PC Anda dari daftar 28 gejala yang tersedia.
2. **Tentukan Tingkat Keyakinan** untuk setiap gejala yang dipilih:

| Pilihan | Nilai CF |
|---|---|
| Sangat Yakin | 1.0 (100%) |
| Yakin | 0.8 (80%) |
| Cukup Yakin | 0.6 (60%) |
| Kurang Yakin | 0.4 (40%) |
| Tidak Tahu | 0.2 (20%) |
| Tidak | 0.0 (0%) |

3. Klik **"Diagnosa Sekarang"** setelah memilih minimal 1 gejala.

### Kategori Gejala

| Kategori | Contoh |
|---|---|
| Tampilan | Tidak ada tampilan, layar putih, bluescreen |
| Daya | Short circuit, PC tidak menyala |
| Performa | Lambat, freeze, blank |
| Sistem | Tidak bisa boot, OS error |
| Penyimpanan | Harddisk error, OS not found |
| Suara & Boot | Bunyi beep panjang/pendek |
| Pendingin | Fan tidak berputar, suhu panas |

---

## 3. Halaman Hasil Diagnosa

Sistem menampilkan:

- **Hasil Utama** — komponen yang paling mungkin rusak beserta persentase CF
- **Ranking Lengkap** — semua komponen diurutkan dari CF tertinggi ke terendah
- **Visualisasi Bar** — perbandingan visual antar komponen
- **Keterangan Status** — Sangat Tinggi / Tinggi / Sedang / Rendah

### Interpretasi Hasil

| CF | Artinya |
|---|---|
| ≥ 75% | Sistem sangat yakin komponen ini bermasalah |
| 50–74% | Kemungkinan besar komponen ini bermasalah |
| 30–49% | Ada indikasi kerusakan, perlu pemeriksaan lebih lanjut |
| < 30% | Kemungkinan kecil, periksa gejala lain |

---

## 4. Tips Penggunaan

- Pilih **semua gejala yang relevan** untuk hasil lebih akurat
- Gunakan **Sangat Yakin** hanya untuk gejala yang benar-benar terjadi
- Hasil dengan CF < 30% sebaiknya dikonsultasikan dengan teknisi
- Sesi diagnosa otomatis tersimpan dan bisa dilihat di panel Admin

---

## 5. Pertanyaan Umum

**Q: Apakah data saya tersimpan?**
A: Ya, setiap sesi diagnosa otomatis tersimpan di database.

**Q: Bisa lihat riwayat diagnosa?**
A: Ya, melalui Panel Admin → menu Riwayat.

**Q: Bisa export hasil ke Excel?**
A: Ya, tersedia di Panel Admin → Riwayat → tombol "Excel" per baris atau "Ekspor Semua".
