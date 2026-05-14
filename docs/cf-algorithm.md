# Algoritma Certainty Factor — SiPakarPC

Penjelasan detail implementasi metode Certainty Factor yang digunakan sistem.

---

## Referensi

Implementasi mengacu pada jurnal:
> *Implementation of Certainty Factor Method for Expert System Diagnosis of PC Hardware Damage*

---

## Konsep Dasar

Certainty Factor (CF) adalah metode untuk merepresentasikan ketidakpastian dalam sistem pakar. CF bernilai antara **-1** (pasti salah) hingga **+1** (pasti benar), namun dalam konteks ini digunakan rentang **0–1**.

### Komponen CF

| Simbol | Nama | Definisi |
|---|---|---|
| MB(H,E) | Measure of Belief | Tingkat kepercayaan bahwa hipotesis H benar, berdasarkan evidence E |
| MD(H,E) | Measure of Disbelief | Tingkat ketidakpercayaan bahwa hipotesis H benar, berdasarkan evidence E |
| CF(H,E) | Certainty Factor Pakar | Nilai CF dari tabel basis pengetahuan |
| CF(E,e) | Certainty Factor User | Tingkat keyakinan user terhadap gejala e |
| CF(H,e) | CF Gabungan per Gejala | Kontribusi satu gejala terhadap hipotesis |

---

## Formula

### 1. CF Pakar (dari Basis Pengetahuan)

```
CF(H,E) = MB(H,E) − MD(H,E)
```

Contoh: MB = 0.85, MD = 0.50 → CF Pakar = 0.35

### 2. CF Gabungan per Gejala

```
CF(H,e) = CF(E,e) × CF(H,E)
```

Di mana:
- `CF(E,e)` = keyakinan user terhadap gejala (0.0 – 1.0)
- `CF(H,E)` = nilai CF pakar dari tabel KB

Contoh: CF User = 0.8, CF Pakar = 0.35 → CF Hasil = 0.8 × 0.35 = 0.28

### 3. CF Combine (Kombinasi Sequential)

Bila suatu komponen memiliki lebih dari satu gejala yang cocok, CF digabungkan secara sequential:

```
CF_combine = CF_old + CF_new × (1 − CF_old)
```

**Contoh Langkah demi Langkah:**
```
Gejala 1: CF₁ = 0.28
Gejala 2: CF₂ = 0.45

Langkah 1: CF_combine = 0.28  (nilai awal)
Langkah 2: CF_combine = 0.28 + 0.45 × (1 − 0.28)
                       = 0.28 + 0.45 × 0.72
                       = 0.28 + 0.324
                       = 0.604
```

**Hasil akhir dalam persen:** `0.604 × 100 = 60.4% ≈ 60%`

---

## Dataset Basis Pengetahuan

### Gejala (E01–E28)

| Kode | Deskripsi | Kategori |
|---|---|---|
| E01 | Tidak ada tampilan pada layar | Tampilan |
| E02 | Indikator lampu panel depan menyala | Daya |
| E03 | Bunyi beep panjang saat dinyalakan | Suara & Boot |
| E04 | Short circuit saat dinyalakan | Daya |
| E05 | OS mati, kursor tidak muncul | Sistem |
| E06 | Fan processor tidak berputar | Pendingin |
| E07 | Sistem berbunyi saat startup | Suara & Boot |
| E08 | OS tidak mau boot | Suara & Boot |
| E09 | Performa komputer melambat | Performa |
| E10 | Komputer sering restart sendiri | Sistem |
| E11 | Monitor tiba-tiba bluescreen | Tampilan |
| E12 | Gagal boot disertai bunyi beep | Suara & Boot |
| E13 | Sering gagal instalasi software baru | Sistem |
| E14 | Performa grafis lambat saat gaming | Tampilan |
| E15 | Bisa masuk BIOS tapi VGA tidak jalan | Tampilan |
| E16 | Resolusi dan kualitas warna tidak optimal | Tampilan |
| E17 | Windows sering not responding | Performa |
| E18 | PC tidak bereaksi, indikator mati | Penyimpanan |
| E19 | Muncul pesan "Harddisk Error" | Penyimpanan |
| E20 | Muncul pesan "Operating System Not Found" | Penyimpanan |
| E21 | Tidak ada suara dan aktivitas harddisk | Penyimpanan |
| E22 | Tampilan layar monitor putih | Tampilan |
| E23 | Monitor tidak menyala sama sekali | Tampilan |
| E24 | Kontras warna pada monitor buram | Tampilan |
| E25 | Komputer mati mendadak saat dipakai | Daya |
| E26 | Komputer blank / freeze | Performa |
| E27 | Loading lambat setelah pemakaian lama | Penyimpanan |
| E28 | Suhu PC sangat panas | Pendingin |

### Komponen (K1–K8) dengan Nilai MB/MD

| Komponen | Gejala | MB | MD | CF Pakar |
|---|---|---|---|---|
| K1 Motherboard | E01 | 0.80 | 0.50 | 0.30 |
| | E02 | 0.85 | 0.40 | 0.45 |
| | E03 | 0.90 | 0.50 | 0.40 |
| | E04 | 0.70 | 0.50 | 0.20 |
| K2 Processor | E05 | 0.80 | 0.50 | 0.30 |
| | E06 | 0.90 | 0.70 | 0.20 |
| | E07 | 0.80 | 0.60 | 0.20 |
| | E08 | 0.85 | 0.60 | 0.25 |
| K3 RAM | E09–E13 | 0.85–0.90 | 0.50 | 0.35–0.40 |
| K4 VGA Card | E14–E17 | 0.80–0.95 | 0.50–0.60 | 0.30–0.35 |
| K5 Power Supply | E02, E04, E18 | 0.85–0.95 | 0.50–0.70 | 0.25–0.45 |
| K6 Harddisk | E17, E19–E21 | 0.85–0.95 | 0.50–0.70 | 0.25–0.35 |
| K7 Monitor | E16, E22–E24 | 0.75–0.95 | 0.50–0.60 | 0.25–0.35 |
| K8 Overheat | E25–E28 | 0.90–0.95 | 0.50–0.70 | 0.20–0.45 |

---

## Implementasi dalam Kode

```typescript
// App.tsx — calculateCF()
const cfRules = rules.map(rule => {
  const userCert  = selected.find(s => s.code === rule.symptomCode)?.certainty ?? 0;
  const pakarCert = rule.mbValue - rule.md_value;           // CF(H,E) = MB - MD
  return userCert * pakarCert;                               // CF(H,e) = CF(E,e) × CF(H,E)
});

let combinedCF = cfRules[0];
for (let i = 1; i < cfRules.length; i++) {
  combinedCF = combinedCF + cfRules[i] * (1 - combinedCF); // CF_combine formula
}

results.push({ component: comp.name, cfValue: Math.round(combinedCF * 100) });
```

```typescript
// exportHelpers.ts — buildCFBreakdowns() (untuk export akademik)
// Merekonstruksi perhitungan step-by-step dengan traceability penuh
// termasuk CFCalculationRow dan CFCombineStep per komponen
```
