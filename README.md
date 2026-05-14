# SiPakarPC — Sistem Pakar Diagnosa Kerusakan PC

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Metode-Certainty%20Factor-FF6B35?style=for-the-badge" />
</p>

> **Sistem Pakar** berbasis web untuk mendiagnosa kerusakan komponen hardware PC menggunakan metode **Certainty Factor (CF)** — dikembangkan sebagai tugas akhir mata kuliah Sistem Pakar.

---

## 📋 Daftar Isi

- [Tentang Sistem](#-tentang-sistem)
- [Fitur Utama](#-fitur-utama)
- [Metode Certainty Factor](#-metode-certainty-factor)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi](#-instalasi)
- [Konfigurasi Database](#-konfigurasi-database)
- [Penggunaan](#-penggunaan)
- [Panel Admin](#-panel-admin)
- [Referensi](#-referensi)

---

## 🧠 Tentang Sistem

SiPakarPC adalah sistem pakar berbasis web yang membantu pengguna mengidentifikasi kerusakan komponen PC berdasarkan gejala-gejala yang dialami. Sistem menggunakan **metode Certainty Factor** yang diadaptasi dari jurnal ilmiah untuk memberikan hasil diagnosa dengan tingkat keyakinan kuantitatif.

**Dataset:**
- **28 Gejala** (E01–E28) mencakup aspek tampilan, daya, performa, sistem, penyimpanan, suara & boot, pendingin
- **8 Komponen Kerusakan** (K1–K8): Motherboard, Processor, RAM, VGA Card, Power Supply, Harddisk, Monitor, Overheat

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🔍 **Diagnosa Interaktif** | Pilih gejala dengan tingkat keyakinan user (Sangat Yakin hingga Tidak) |
| 📊 **Hasil Ranking** | Semua komponen diranking berdasarkan nilai CF akhir |
| 📁 **Riwayat Diagnosa** | Semua sesi tersimpan di Supabase, dapat difilter dan dicari |
| 📤 **Export Excel Profesional** | Export semua riwayat atau detail per-sesi (5 sheet: Info, Gejala, CF Calc, Ranking, Solusi) |
| 🔐 **Panel Admin** | Kelola gejala, komponen, basis pengetahuan, dan riwayat |
| 📈 **Dashboard Analitik** | Grafik tren, distribusi kerusakan, distribusi CF, statistik real-time |
| 🧮 **Transparansi CF** | Tampilkan step-by-step perhitungan CF untuk keperluan akademik |

---

## 🧮 Metode Certainty Factor

Sistem mengimplementasikan metode CF sesuai referensi jurnal:

### Formula

```
CF(H,E) = MB(H,E) − MD(H,E)          // CF Pakar dari tabel basis pengetahuan
CF(H,e) = CF(E,e) × CF(H,E)          // CF per gejala dengan keyakinan user
CF_combine = CF_old + CF_new × (1 − CF_old)   // Kombinasi sequential
```

### Tingkat Keyakinan User

| Label | Nilai |
|---|---|
| Sangat Yakin | 1.0 |
| Yakin | 0.8 |
| Cukup Yakin | 0.6 |
| Kurang Yakin | 0.4 |
| Tidak Tahu | 0.2 |
| Tidak | 0.0 |

### Interpretasi Hasil

| Persentase CF | Kategori |
|---|---|
| ≥ 75% | Sangat Tinggi |
| 50–74% | Tinggi |
| 30–49% | Sedang |
| < 30% | Rendah |

---

## 🛠 Teknologi

| Layer | Teknologi |
|---|---|
| **Frontend** | React 18 + TypeScript 5 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI + shadcn/ui |
| **Charting** | Recharts |
| **Backend/DB** | Supabase (PostgreSQL + RLS) |
| **Export** | ExcelJS + FileSaver |
| **Icons** | Lucide React |
| **Toast** | Sonner |

---

## 📁 Struktur Proyek

```
sipakarpc/
├── database/               # SQL schema & seed data
│   ├── schema.sql          # Tabel Supabase + RLS policies
│   └── seed.sql            # Data awal gejala, komponen, dan KB rules
│
├── docs/                   # Dokumentasi teknis dan penggunaan
│   ├── penggunaan.md       # Panduan pengguna
│   ├── admin-guide.md      # Panduan administrator
│   ├── cf-algorithm.md     # Detail algoritma Certainty Factor
│   └── export-guide.md     # Panduan fitur export Excel
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/      # AdminDashboard, AdminHistory, AdminSymptoms, dll.
│   │   │   └── ...         # DiagnosisPage, ResultsPage, HomePage
│   │   ├── data/
│   │   │   └── adminStore.ts  # Supabase data layer + type definitions
│   │   ├── utils/
│   │   │   ├── exportTypes.ts    # Type definitions untuk export
│   │   │   ├── exportHelpers.ts  # CF reconstructor + formatters
│   │   │   └── exportExcel.ts    # ExcelJS engine (5-sheet workbook)
│   │   └── App.tsx         # Root: routing, CF calculator, saveHistory
│   └── lib/
│       └── supabase.ts     # Supabase client
│
├── .env                    # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── package.json
└── vite.config.ts
```

---

## 🚀 Instalasi

### Prasyarat

- Node.js ≥ 18
- npm ≥ 9 atau pnpm ≥ 8
- Akun [Supabase](https://supabase.com) (gratis)

### Langkah-langkah

```bash
# 1. Clone repositori
git clone <repo-url>
cd sipakarpc

# 2. Install dependensi
npm install

# 3. Salin file environment
cp .env.example .env
# Edit .env dengan URL dan key Supabase Anda

# 4. Setup database (lihat bagian Konfigurasi Database)

# 5. Jalankan dev server
npm run dev
```

---

## 🗄 Konfigurasi Database

1. Buat project baru di [Supabase Dashboard](https://app.supabase.com)
2. Buka **SQL Editor**
3. Jalankan `database/schema.sql` — membuat tabel dan RLS policies
4. Jalankan `database/seed.sql` — mengisi data awal gejala, komponen, dan rules KB
5. Salin **Project URL** dan **anon key** ke file `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📖 Penggunaan

Lihat **[docs/penggunaan.md](docs/penggunaan.md)** untuk panduan lengkap pengguna.

---

## 🔐 Panel Admin

Lihat **[docs/admin-guide.md](docs/admin-guide.md)** untuk panduan administrator.

**Akses admin:** Klik tombol "Admin" di halaman utama → masukkan password admin.

---

## 📚 Referensi

- Jurnal: *Implementation of Certainty Factor Method for Expert System Diagnosis of PC Hardware Damage* (terlampir di folder proyek)
- [Supabase Documentation](https://supabase.com/docs)
- [ExcelJS Documentation](https://github.com/exceljs/exceljs)
- [React Documentation](https://react.dev)

---

<p align="center">
  Dibuat dengan ❤️ untuk keperluan akademik — Tugas Akhir Mata Kuliah Sistem Pakar
</p>