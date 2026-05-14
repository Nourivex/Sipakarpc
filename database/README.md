# Database — SiPakarPC

Folder ini berisi semua file SQL untuk setup Supabase.

## File

| File | Deskripsi |
|---|---|
| `schema.sql` | DDL: membuat tabel, index, dan RLS policies |
| `seed.sql` | DML: data awal gejala (E01–E28), komponen (K1–K8), dan rules basis pengetahuan |

## Cara Menjalankan

1. Buka [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
2. Jalankan `schema.sql` terlebih dahulu
3. Jalankan `seed.sql` setelah schema berhasil

## Struktur Tabel

```
symptoms          → id, code, description, category
components        → id, name, description, icon
kb_rules          → symptom_code, component_name, mb_value, md_value
diagnosis_history → id, created_at, selected_symptoms (JSONB), main_diagnosis, confidence, all_results (JSONB)
```

## Catatan

- RLS (Row Level Security) diaktifkan untuk semua tabel
- `diagnosis_history` menggunakan JSONB untuk fleksibilitas penyimpanan array gejala dan hasil
- MB/MD value mengacu pada Tabel 4 dalam jurnal referensi
