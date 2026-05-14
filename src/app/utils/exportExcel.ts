/**
 * exportExcel.ts
 * Professional ExcelJS-based export for SiPakarPC diagnosis system.
 *
 * Two public functions:
 *   - exportAllHistory(payload)   → history-diagnosa.xlsx
 *   - exportSingleHistory(payload) → detail-diagnosa-{id}.xlsx  (5-sheet workbook)
 */

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { AllExportPayload, SingleExportPayload } from './exportTypes';
import {
  formatDateReadable,
  confidenceStatus,
  buildCFBreakdowns,
  buildRankedResults,
  buildSolutions,
  round,
} from './exportHelpers';
import { defaultKBRelations } from '../data/adminStore';

// ─────────────────────────────────────────────────────────────────────────────
// STYLE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COLOR = {
  headerBg: '1E40AF',     // deep blue
  headerFg: 'FFFFFF',
  titleBg: '1E3A8A',
  titleFg: 'FFFFFF',
  altRow: 'EFF6FF',
  subheaderBg: '3B82F6',
  subheaderFg: 'FFFFFF',
  sectionBg: 'DBEAFE',
  borderColor: 'BFDBFE',
  green: '16A34A',
  yellow: 'CA8A04',
  red: 'DC2626',
};

function headerFill(hex: string): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${hex}` } };
}

function headerFont(hex = 'FFFFFF', bold = true, size = 11): ExcelJS.Font {
  return { name: 'Calibri', color: { argb: `FF${hex}` }, bold, size };
}

function thinBorder(): ExcelJS.Borders {
  const side: ExcelJS.BorderStyle = 'thin';
  const b = { style: side, color: { argb: `FF${COLOR.borderColor}` } };
  return { top: b, left: b, bottom: b, right: b };
}

function applyHeaderRow(row: ExcelJS.Row, bgHex = COLOR.headerBg) {
  row.eachCell((cell) => {
    cell.fill = headerFill(bgHex);
    cell.font = headerFont();
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = thinBorder();
  });
  row.height = 28;
}

function applyDataRow(row: ExcelJS.Row, isAlt: boolean) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = isAlt
      ? headerFill(COLOR.altRow)
      : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    cell.font = { name: 'Calibri', size: 10 };
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = thinBorder();
  });
  row.height = 20;
}

function autoWidth(sheet: ExcelJS.Worksheet, minWidth = 12, maxWidth = 60) {
  sheet.columns.forEach((col) => {
    let maxLen = minWidth;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const len = cell.text?.toString().length ?? 0;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 4, maxWidth);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ALL HISTORY
// ─────────────────────────────────────────────────────────────────────────────

export async function exportAllHistory({ history, symptoms }: AllExportPayload): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SiPakarPC – Sistem Pakar Diagnosa Kerusakan PC';
  wb.created = new Date();

  const ws = wb.addWorksheet('Riwayat Diagnosa', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  });

  // Title row
  ws.mergeCells('A1:G1');
  const titleCell = ws.getCell('A1');
  titleCell.value = 'LAPORAN RIWAYAT DIAGNOSA – SISTEM PAKAR DIAGNOSA KERUSAKAN PC';
  titleCell.font = { name: 'Calibri', bold: true, size: 14, color: { argb: `FF${COLOR.titleFg}` } };
  titleCell.fill = headerFill(COLOR.titleBg);
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 36;

  // Subtitle row
  ws.mergeCells('A2:G2');
  const subCell = ws.getCell('A2');
  subCell.value = `Metode: Certainty Factor  |  Digenerate: ${formatDateReadable(new Date().toISOString())}  |  Total: ${history.length} Sesi`;
  subCell.font = { name: 'Calibri', italic: true, size: 10, color: { argb: `FF${COLOR.titleFg}` } };
  subCell.fill = headerFill(COLOR.subheaderBg);
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 20;

  ws.addRow([]); // spacer

  // Header row
  const header = ws.addRow([
    'No.',
    'ID Diagnosa',
    'Tanggal',
    'Hasil Diagnosa',
    'Persentase Keyakinan',
    'Jumlah Gejala',
    'Metode',
  ]);
  applyHeaderRow(header);

  // Data rows
  history.forEach((h, idx) => {
    const row = ws.addRow([
      idx + 1,
      h.id.slice(0, 8).toUpperCase(),
      formatDateReadable(h.date),
      h.mainDiagnosis,
      `${h.confidence}%`,
      h.symptoms.length,
      'Certainty Factor',
    ]);
    applyDataRow(row, idx % 2 === 0);

    // Color the percentage cell based on confidence
    const pctCell = row.getCell(5);
    if (h.confidence >= 75) pctCell.font = { name: 'Calibri', bold: true, color: { argb: `FF${COLOR.green}` } };
    else if (h.confidence >= 50) pctCell.font = { name: 'Calibri', bold: true, color: { argb: 'FF2563EB' } };
    else pctCell.font = { name: 'Calibri', bold: true, color: { argb: `FF${COLOR.yellow}` } };
  });

  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'id', width: 14 },
    { key: 'date', width: 28 },
    { key: 'result', width: 20 },
    { key: 'pct', width: 20 },
    { key: 'symptoms', width: 16 },
    { key: 'method', width: 18 },
  ];

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), 'history-diagnosa.xlsx');
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT SINGLE HISTORY — 5-SHEET WORKBOOK
// ─────────────────────────────────────────────────────────────────────────────

export async function exportSingleHistory({ history, symptoms, kbRelations }: SingleExportPayload): Promise<void> {
  const kb = kbRelations.length > 0 ? kbRelations : defaultKBRelations;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'SiPakarPC – Sistem Pakar Diagnosa Kerusakan PC';
  wb.created = new Date();

  await buildSheet1Info(wb, history);
  await buildSheet2Symptoms(wb, history, symptoms);
  await buildSheet3CFCalc(wb, history, symptoms, kb);
  await buildSheet4Ranking(wb, history);
  await buildSheet5Solutions(wb, history);

  const shortId = history.id.slice(0, 8).toUpperCase();
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `detail-diagnosa-${shortId}.xlsx`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 1 — INFORMASI DIAGNOSA
// ─────────────────────────────────────────────────────────────────────────────

async function buildSheet1Info(wb: ExcelJS.Workbook, history: import('./exportTypes').DiagnosisHistory) {
  const ws = wb.addWorksheet('1. Informasi Diagnosa');

  // Big title
  ws.mergeCells('A1:D1');
  const t1 = ws.getCell('A1');
  t1.value = 'SISTEM PAKAR DIAGNOSA KERUSAKAN PC';
  t1.font = { name: 'Calibri', bold: true, size: 16, color: { argb: `FF${COLOR.titleFg}` } };
  t1.fill = headerFill(COLOR.titleBg);
  t1.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 40;

  ws.mergeCells('A2:D2');
  const t2 = ws.getCell('A2');
  t2.value = 'Metode Certainty Factor (CF)';
  t2.font = { name: 'Calibri', bold: true, size: 12, color: { argb: `FF${COLOR.subheaderFg}` } };
  t2.fill = headerFill(COLOR.subheaderBg);
  t2.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 26;

  ws.addRow([]);

  // Info fields
  const fields: [string, string][] = [
    ['ID Diagnosa', history.id.toUpperCase()],
    ['Tanggal', formatDateReadable(history.date)],
    ['Hasil Utama', history.mainDiagnosis],
    ['Persentase Keyakinan', `${history.confidence}%`],
    ['Status Keyakinan', confidenceStatus(history.confidence)],
    ['Jumlah Gejala Dipilih', String(history.symptoms.length)],
    ['Jumlah Komponen Dianalisis', String(history.allResults.filter((r) => r.cfValue > 0).length)],
    ['Metode Inferensi', 'Certainty Factor (Forward Chaining)'],
    ['Formula CF Pakar', 'CF(H,E) = MB(H,E) − MD(H,E)'],
    ['Formula CF Gabungan', 'CF(H,e) = CF(E,e) × CF(H,E)'],
    ['Formula CF Combine', 'CF_combine = CF_old + CF_new × (1 − CF_old)'],
  ];

  fields.forEach(([label, value], idx) => {
    const row = ws.addRow([label, value]);
    row.height = 22;
    const labelCell = row.getCell(1);
    const valueCell = row.getCell(2);

    labelCell.font = { name: 'Calibri', bold: true, size: 11 };
    labelCell.fill = headerFill(idx % 2 === 0 ? COLOR.sectionBg : 'FFFFFF');
    labelCell.alignment = { vertical: 'middle' };
    labelCell.border = thinBorder();

    valueCell.font = { name: 'Calibri', size: 11 };
    valueCell.fill = headerFill(idx % 2 === 0 ? 'EFF6FF' : 'FFFFFF');
    valueCell.alignment = { vertical: 'middle', wrapText: true };
    valueCell.border = thinBorder();

    // Highlight main result
    if (label === 'Persentase Keyakinan') {
      valueCell.font = { name: 'Calibri', bold: true, size: 13, color: { argb: `FF${COLOR.green}` } };
    }
  });

  ws.getColumn(1).width = 35;
  ws.getColumn(2).width = 55;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 2 — GEJALA TERPILIH
// ─────────────────────────────────────────────────────────────────────────────

async function buildSheet2Symptoms(
  wb: ExcelJS.Workbook,
  history: import('./exportTypes').DiagnosisHistory,
  symptoms: import('./exportTypes').Symptom[]
) {
  const ws = wb.addWorksheet('2. Gejala Terpilih');

  ws.mergeCells('A1:D1');
  const t = ws.getCell('A1');
  t.value = 'DAFTAR GEJALA YANG DIPILIH PENGGUNA';
  t.font = headerFont(COLOR.titleFg, true, 13);
  t.fill = headerFill(COLOR.titleBg);
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 32;
  ws.addRow([]);

  const header = ws.addRow(['No.', 'Kode Gejala', 'Nama Gejala', 'Keyakinan User']);
  applyHeaderRow(header);

  history.symptoms.forEach((s, idx) => {
    const sym = symptoms.find((sym) => sym.code === s.code);
    const row = ws.addRow([
      idx + 1,
      s.code,
      sym?.description ?? s.code,
      `${Math.round(s.certainty * 100)}%`,
    ]);
    applyDataRow(row, idx % 2 === 0);
    row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
  });

  ws.columns = [
    { width: 6 }, { width: 14 }, { width: 60 }, { width: 18 },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 3 — PERHITUNGAN CERTAINTY FACTOR
// ─────────────────────────────────────────────────────────────────────────────

async function buildSheet3CFCalc(
  wb: ExcelJS.Workbook,
  history: import('./exportTypes').DiagnosisHistory,
  symptoms: import('./exportTypes').Symptom[],
  kbRelations: import('./exportTypes').KBRelation[]
) {
  const ws = wb.addWorksheet('3. Perhitungan CF');

  ws.mergeCells('A1:G1');
  const t = ws.getCell('A1');
  t.value = 'DETAIL PERHITUNGAN CERTAINTY FACTOR';
  t.font = headerFont(COLOR.titleFg, true, 13);
  t.fill = headerFill(COLOR.titleBg);
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 32;

  ws.mergeCells('A2:G2');
  const sub = ws.getCell('A2');
  sub.value = 'CF(H,E) = MB − MD  |  CF(H,e) = CF(E,e) × CF(H,E)  |  CF_combine = CF_old + CF_new × (1 − CF_old)';
  sub.font = { name: 'Calibri', italic: true, size: 9, color: { argb: 'FF4B5563' } };
  sub.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 18;

  const breakdowns = buildCFBreakdowns(history, symptoms, kbRelations);

  let rowIdx = 4;

  for (const bd of breakdowns) {
    // Component section header
    ws.mergeCells(`A${rowIdx}:G${rowIdx}`);
    const compCell = ws.getCell(`A${rowIdx}`);
    compCell.value = `▶ KOMPONEN: ${bd.componentName}`;
    compCell.font = { name: 'Calibri', bold: true, size: 12, color: { argb: `FF${COLOR.titleFg}` } };
    compCell.fill = headerFill(COLOR.subheaderBg);
    compCell.alignment = { vertical: 'middle' };
    ws.getRow(rowIdx).height = 24;
    rowIdx++;

    // Per-gejala table header
    const h1 = ws.addRow(['No.', 'Kode', 'Nama Gejala', 'MB', 'MD', 'CF Pakar\n(MB−MD)', 'CF User', 'CF Hasil\n(User×Pakar)']);
    applyHeaderRow(h1, COLOR.headerBg);
    h1.height = 36;
    rowIdx++;

    bd.rows.forEach((r, i) => {
      const dataRow = ws.addRow([
        i + 1,
        r.symptomCode,
        r.symptomName,
        r.mb.toFixed(2),
        r.md.toFixed(2),
        r.cfPakar.toFixed(4),
        r.cfUser.toFixed(2),
        r.cfHasil.toFixed(4),
      ]);
      applyDataRow(dataRow, i % 2 === 0);
      // Right-align numerics
      [4, 5, 6, 7, 8].forEach((col) => {
        dataRow.getCell(col).alignment = { horizontal: 'right', vertical: 'middle' };
      });
      rowIdx++;
    });

    rowIdx++; // spacer

    // Combine steps header
    const h2 = ws.addRow(['Langkah', 'Gejala', 'CF Lama (CF_old)', 'CF Baru (CF_new)', 'CF Combine = CF_old + CF_new × (1 − CF_old)', '', '']);
    applyHeaderRow(h2, '7C3AED');
    h2.height = 32;
    rowIdx++;

    bd.combineSteps.forEach((step, i) => {
      const formula =
        step.step === 1
          ? `${step.cfCombined.toFixed(4)} (nilai awal)`
          : `${round(step.cfOld).toFixed(4)} + ${step.cfNew.toFixed(4)} × (1 − ${round(step.cfOld).toFixed(4)}) = ${step.cfCombined.toFixed(4)}`;

      const dataRow = ws.addRow([
        `Langkah ${step.step}`,
        step.symptomCode,
        step.cfOld.toFixed(4),
        step.cfNew.toFixed(4),
        formula,
        '',
        '',
      ]);
      applyDataRow(dataRow, i % 2 === 0);
      rowIdx++;
    });

    // Final CF result
    rowIdx++;
    const finalRow = ws.addRow([
      '',
      '',
      '',
      '',
      `CF Final ${bd.componentName}`,
      bd.finalCF.toFixed(4),
      `${bd.finalPercent}%`,
    ]);
    finalRow.eachCell((cell) => {
      cell.font = { name: 'Calibri', bold: true, size: 11, color: { argb: 'FF1E40AF' } };
      cell.fill = headerFill(COLOR.sectionBg);
      cell.border = thinBorder();
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    });
    finalRow.height = 22;

    rowIdx += 3; // spacer between components
  }

  ws.columns = [
    { width: 12 }, { width: 10 }, { width: 42 },
    { width: 8 }, { width: 8 }, { width: 14 }, { width: 10 }, { width: 14 },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 4 — RANKING HASIL DIAGNOSA
// ─────────────────────────────────────────────────────────────────────────────

async function buildSheet4Ranking(wb: ExcelJS.Workbook, history: import('./exportTypes').DiagnosisHistory) {
  const ws = wb.addWorksheet('4. Ranking Diagnosa');

  ws.mergeCells('A1:E1');
  const t = ws.getCell('A1');
  t.value = 'RANKING HASIL DIAGNOSA (Descending)';
  t.font = headerFont(COLOR.titleFg, true, 13);
  t.fill = headerFill(COLOR.titleBg);
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 32;
  ws.addRow([]);

  const header = ws.addRow(['Ranking', 'Jenis Kerusakan', 'Nilai CF (Desimal)', 'Persentase', 'Status']);
  applyHeaderRow(header);

  const ranked = buildRankedResults(history);
  ranked.forEach((r, idx) => {
    const row = ws.addRow([
      r.rank,
      r.component,
      (r.percent / 100).toFixed(4),
      `${r.percent}%`,
      r.status,
    ]);
    applyDataRow(row, idx % 2 === 0);

    // Status cell color
    const statusCell = row.getCell(5);
    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (r.status === 'Tinggi') {
      statusCell.font = { name: 'Calibri', bold: true, color: { argb: `FF${COLOR.green}` } };
    } else if (r.status === 'Sedang') {
      statusCell.font = { name: 'Calibri', bold: true, color: { argb: 'FF2563EB' } };
    } else {
      statusCell.font = { name: 'Calibri', bold: true, color: { argb: `FF${COLOR.yellow}` } };
    }

    // Bold top result
    if (r.rank === 1) {
      row.eachCell((cell) => {
        cell.fill = headerFill('FEF9C3');
        cell.font = { ...cell.font, name: 'Calibri', bold: true };
      });
    }
  });

  ws.columns = [{ width: 10 }, { width: 22 }, { width: 20 }, { width: 16 }, { width: 14 }];
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 5 — SOLUSI & SARAN
// ─────────────────────────────────────────────────────────────────────────────

async function buildSheet5Solutions(wb: ExcelJS.Workbook, history: import('./exportTypes').DiagnosisHistory) {
  const ws = wb.addWorksheet('5. Solusi & Saran');

  ws.mergeCells('A1:C1');
  const t = ws.getCell('A1');
  t.value = 'SOLUSI DAN SARAN PENANGANAN';
  t.font = headerFont(COLOR.titleFg, true, 13);
  t.fill = headerFill(COLOR.titleBg);
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 32;
  ws.addRow([]);

  const header = ws.addRow(['Jenis Kerusakan', 'Solusi', 'Saran Penanganan']);
  applyHeaderRow(header);

  const solutions = buildSolutions(history);
  solutions.forEach((s, idx) => {
    const row = ws.addRow([s.component, s.solution, s.advice]);
    applyDataRow(row, idx % 2 === 0);
    row.height = 60;
    [1, 2, 3].forEach((col) => {
      row.getCell(col).alignment = { vertical: 'top', wrapText: true };
    });
  });

  ws.columns = [{ width: 22 }, { width: 55 }, { width: 65 }];
}
