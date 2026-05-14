/**
 * exportHelpers.ts
 * Pure computation and formatting helpers for the CF export system.
 * All functions are stateless and deterministic — safe to unit-test.
 */

import type {
  DiagnosisHistory,
  Symptom,
  KBRelation,
  CFCalculationRow,
  CFCombineStep,
  CFComponentBreakdown,
  RankedResult,
  ComponentSolution,
} from './exportTypes';

// ─────────────────────────────────────────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────────────────────────────────────────

/** Format an ISO/locale date string to readable Indonesian format. */
export function formatDateReadable(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  } catch {
    // ignore parse errors
  }
  return dateStr;
}

/** Format a decimal CF value to a readable percentage string. */
export function formatPercent(decimal: number): string {
  return `${Math.round(decimal * 100)}%`;
}

/** Round a number to N decimal places. */
export function round(n: number, places = 4): number {
  return Math.round(n * 10 ** places) / 10 ** places;
}

/** Map a confidence integer (0–100) to a status label. */
export function confidenceStatus(percent: number): 'Tinggi' | 'Sedang' | 'Rendah' {
  if (percent >= 75) return 'Tinggi';
  if (percent >= 50) return 'Sedang';
  return 'Rendah';
}

/** Map user certainty decimal to its Indonesian label. */
export function userCertaintyLabel(value: number): string {
  if (value >= 1.0) return 'Sangat Yakin';
  if (value >= 0.8) return 'Yakin';
  if (value >= 0.6) return 'Cukup Yakin';
  if (value >= 0.4) return 'Kurang Yakin';
  if (value >= 0.2) return 'Tidak Tahu';
  return 'Tidak';
}

// ─────────────────────────────────────────────────────────────────────────────
// CF CALCULATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reconstruct the full CF breakdown for every component from a diagnosis history entry.
 * This mirrors the logic in App.tsx calculateCF, but adds step-by-step traceability
 * for academic presentation.
 */
export function buildCFBreakdowns(
  history: DiagnosisHistory,
  symptoms: Symptom[],
  kbRelations: KBRelation[]
): CFComponentBreakdown[] {
  const componentNames = Array.from(
    new Set(kbRelations.map((r) => r.componentName))
  ).sort();

  const breakdowns: CFComponentBreakdown[] = [];

  for (const compName of componentNames) {
    const selectedCodes = history.symptoms.map((s) => s.code);

    // Rules for this component that intersect selected symptoms
    const matchedRules = kbRelations.filter(
      (r) => r.componentName === compName && selectedCodes.includes(r.symptomCode)
    );

    if (matchedRules.length === 0) continue;

    // Build per-row calculation
    const rows: CFCalculationRow[] = matchedRules.map((rule) => {
      const userSym = history.symptoms.find((s) => s.code === rule.symptomCode);
      const cfUser = userSym?.certainty ?? 0;
      const cfPakar = round(rule.mbValue - rule.md_value);
      const cfHasil = round(cfUser * cfPakar);
      const symptomMeta = symptoms.find((s) => s.code === rule.symptomCode);

      return {
        symptomCode: rule.symptomCode,
        symptomName: symptomMeta?.description ?? rule.symptomCode,
        mb: rule.mbValue,
        md: rule.md_value,
        cfPakar,
        cfUser,
        cfHasil,
      };
    });

    // Build combine steps: CF_combine = CF_old + CF_new * (1 - CF_old)
    const cfValues = rows.map((r) => r.cfHasil);
    const combineSteps: CFCombineStep[] = [];
    let combined = cfValues[0];

    if (cfValues.length === 1) {
      combineSteps.push({
        step: 1,
        symptomCode: rows[0].symptomCode,
        cfNew: cfValues[0],
        cfOld: 0,
        cfCombined: round(cfValues[0]),
      });
    } else {
      // First step
      combineSteps.push({
        step: 1,
        symptomCode: rows[0].symptomCode,
        cfNew: cfValues[0],
        cfOld: 0,
        cfCombined: round(cfValues[0]),
      });

      for (let i = 1; i < cfValues.length; i++) {
        const cfOld = combined;
        const cfNew = cfValues[i];
        combined = round(cfOld + cfNew * (1 - cfOld));
        combineSteps.push({
          step: i + 1,
          symptomCode: rows[i].symptomCode,
          cfNew,
          cfOld: round(cfOld),
          cfCombined: combined,
        });
      }
    }

    breakdowns.push({
      componentName: compName,
      rows,
      combineSteps,
      finalCF: combined,
      finalPercent: Math.round(combined * 100),
    });
  }

  return breakdowns.sort((a, b) => b.finalPercent - a.finalPercent);
}

// ─────────────────────────────────────────────────────────────────────────────
// RANKED RESULTS
// ─────────────────────────────────────────────────────────────────────────────

export function buildRankedResults(history: DiagnosisHistory): RankedResult[] {
  return [...history.allResults]
    .sort((a, b) => b.cfValue - a.cfValue)
    .map((r, idx) => ({
      rank: idx + 1,
      component: r.component,
      percent: r.cfValue,
      status: confidenceStatus(r.cfValue),
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION DATABASE
// ─────────────────────────────────────────────────────────────────────────────

const SOLUTIONS: Record<string, { solution: string; advice: string }> = {
  Motherboard: {
    solution: 'Periksa kapasitor yang menggembung, bersihkan slot komponen, dan lakukan POST test.',
    advice:
      'Jika motherboard rusak secara fisik, segera ganti dengan model yang kompatibel. Hindari overclock berlebihan dan pastikan pendingin berfungsi optimal.',
  },
  Processor: {
    solution: 'Bersihkan thermal paste lama dan aplikasikan pasta termal baru. Pastikan heatsink terpasang dengan benar.',
    advice:
      'Periksa suhu CPU menggunakan software monitoring. Jika CPU sering overheat, pertimbangkan penggantian sistem pendingin. Hindari pemakaian heavy-load tanpa ventilasi yang memadai.',
  },
  RAM: {
    solution:
      'Cabut dan pasang kembali RAM (re-seat). Coba satu modul sekaligus untuk menemukan yang bermasalah. Bersihkan konektor RAM dengan penghapus.',
    advice:
      'Jalankan MemTest86 untuk mendeteksi bad sector pada RAM. Jika error ditemukan, RAM perlu diganti. Pastikan RAM terpasang di slot yang tepat sesuai dual-channel.',
  },
  'VGA Card': {
    solution:
      'Bersihkan slot PCIe dan re-seat kartu grafis. Update atau rollback driver VGA. Pastikan konektor daya tambahan terhubung.',
    advice:
      'Pantau suhu GPU menggunakan GPU-Z atau MSI Afterburner. Jika terjadi artifact pada layar, kemungkinan VRAM mengalami kerusakan fisik dan perlu penggantian.',
  },
  'Power Supplay': {
    solution:
      'Uji PSU dengan multimeter (Metode Paperclip Test). Periksa kabel dan konektor daya ke semua komponen.',
    advice:
      'Ganti PSU jika tidak mampu memberikan wattage yang cukup. Gunakan PSU dengan sertifikasi 80+ untuk efisiensi dan keandalan yang lebih baik.',
  },
  Harddisk: {
    solution:
      'Jalankan SMART test menggunakan CrystalDiskInfo. Periksa kabel SATA dan konektor daya ke harddisk.',
    advice:
      'Segera backup data jika SMART menunjukkan status Caution atau Bad. Pertimbangkan migrasi ke SSD untuk performa dan keandalan yang lebih baik.',
  },
  Monitor: {
    solution:
      'Periksa kabel video (HDMI/DisplayPort/VGA). Coba gunakan monitor lain untuk isolasi masalah. Periksa backlight dan panel LCD.',
    advice:
      'Jika backlight mati, komponen inverter atau backlight LED perlu diganti oleh teknisi. Hindari tekanan fisik pada panel LCD untuk mencegah kerusakan piksel.',
  },
  Overheat: {
    solution:
      'Bersihkan debu pada heatsink, fan, dan ventilasi casing. Aplikasikan thermal paste baru pada CPU dan GPU.',
    advice:
      'Pastikan aliran udara dalam casing baik (intake dan exhaust seimbang). Pertimbangkan penambahan case fan atau upgrade sistem pendingin. Monitor suhu secara berkala.',
  },
};

export function buildSolutions(history: DiagnosisHistory): ComponentSolution[] {
  const topResults = [...history.allResults]
    .filter((r) => r.cfValue > 0)
    .sort((a, b) => b.cfValue - a.cfValue);

  return topResults.map((r) => ({
    component: r.component,
    solution: SOLUTIONS[r.component]?.solution ?? 'Konsultasikan dengan teknisi komputer berpengalaman.',
    advice: SOLUTIONS[r.component]?.advice ?? 'Lakukan perawatan rutin dan hindari penggunaan yang tidak sesuai spesifikasi.',
  }));
}
