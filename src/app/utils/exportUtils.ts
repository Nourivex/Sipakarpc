import * as XLSX from 'xlsx';
import { DiagnosisHistory, Symptom } from '../data/adminStore';

export function exportHistoryToExcel(history: DiagnosisHistory[], allSymptoms: Symptom[]) {
  // 1. Prepare Main Summary Sheet
  const summaryData = history.map((h, idx) => ({
    'No': idx + 1,
    'ID Sesi': h.id,
    'Tanggal': h.date,
    'Gejala Dipilih': h.symptoms.map(s => s.code).join(', '),
    'Hasil Diagnosis': h.mainDiagnosis,
    'Keyakinan (CF)': `${h.confidence}%`,
  }));

  // 2. Prepare Detailed Math Sheet (Replicating "Jurnal Pakar CF" style)
  const mathData: any[] = [];
  
  history.forEach((h, hIdx) => {
    mathData.push({ 'Sesi': `Sesi ${hIdx + 1} (${h.date})`, 'Komponen': '', 'Perhitungan': '' });
    
    h.allResults.forEach(res => {
      if (res.cfValue > 0) {
        mathData.push({
          'Sesi': '',
          'Komponen': res.component,
          'Perhitungan': `CF Combine Final: ${res.cfValue}%`
        });
      }
    });
    mathData.push({}); // Empty row separator
  });

  const wb = XLSX.utils.book_new();
  
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Diagnosis');
  
  const wsMath = XLSX.utils.json_to_sheet(mathData);
  XLSX.utils.book_append_sheet(wb, wsMath, 'Detail Perhitungan');

  // Auto-size columns
  const maxWidth = summaryData.reduce((w, r) => Math.max(w, r['Gejala Dipilih'].length), 20);
  wsSummary['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: maxWidth }, { wch: 20 }, { wch: 15 }];

  XLSX.writeFile(wb, `Laporan_SiPakarPC_${new Date().toISOString().split('T')[0]}.xlsx`);
}
