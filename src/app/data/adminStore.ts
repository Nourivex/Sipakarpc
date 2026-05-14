// Shared data store for the admin panel
// Uses localStorage for persistence

export interface Symptom {
  id: string;
  code: string;
  description: string;
  category: string;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface KBRelation {
  symptomCode: string;
  componentName: string;
  cfValue: number;
}

export interface DiagnosisHistory {
  id: string;
  date: string;
  symptoms: string[];
  mainDiagnosis: string;
  confidence: number;
  allResults: { component: string; cfValue: number }[];
}

export const defaultSymptoms: Symptom[] = [
  { id: 'E01', code: 'E01', description: 'Tidak ada tampilan di layar komputer', category: 'Tampilan' },
  { id: 'E02', code: 'E02', description: 'Lampu indikator panel depan menyala', category: 'Daya' },
  { id: 'E03', code: 'E03', description: 'Bunyi beep panjang saat komputer dinyalakan', category: 'Suara & Boot' },
  { id: 'E04', code: 'E04', description: 'Terjadi hubungan singkat saat komputer dinyalakan', category: 'Daya' },
  { id: 'E05', code: 'E05', description: 'Sistem operasi mati mendadak', category: 'Sistem' },
  { id: 'E06', code: 'E06', description: 'Kipas processor tidak berputar', category: 'Pendingin' },
  { id: 'E07', code: 'E07', description: 'Bunyi sistem saat startup', category: 'Suara & Boot' },
  { id: 'E08', code: 'E08', description: 'OS tidak mau boot', category: 'Suara & Boot' },
  { id: 'E09', code: 'E09', description: 'Performa komputer melambat drastis', category: 'Performa' },
  { id: 'E10', code: 'E10', description: 'Komputer sering restart sendiri', category: 'Sistem' },
  { id: 'E11', code: 'E11', description: 'Monitor menampilkan layar biru (bluescreen)', category: 'Tampilan' },
  { id: 'E12', code: 'E12', description: 'Komputer gagal boot dan berbunyi beep', category: 'Suara & Boot' },
  { id: 'E13', code: 'E13', description: 'Gagal menginstall software/program', category: 'Sistem' },
  { id: 'E14', code: 'E14', description: 'Performa grafis lambat atau patah-patah', category: 'Tampilan' },
  { id: 'E15', code: 'E15', description: 'VGA tidak bekerja atau tidak terdeteksi', category: 'Tampilan' },
  { id: 'E16', code: 'E16', description: 'Resolusi layar tidak optimal', category: 'Tampilan' },
  { id: 'E17', code: 'E17', description: 'Windows tidak merespon (hang)', category: 'Performa' },
  { id: 'E18', code: 'E18', description: 'Harddisk tidak terbaca oleh sistem', category: 'Penyimpanan' },
  { id: 'E19', code: 'E19', description: 'Muncul pesan error harddisk', category: 'Penyimpanan' },
  { id: 'E20', code: 'E20', description: 'Operating System Not Found', category: 'Penyimpanan' },
  { id: 'E21', code: 'E21', description: 'Tidak ada suara/aktivitas dari harddisk', category: 'Penyimpanan' },
  { id: 'E22', code: 'E22', description: 'Monitor menampilkan layar putih kosong', category: 'Tampilan' },
  { id: 'E23', code: 'E23', description: 'Monitor tidak menyala sama sekali', category: 'Tampilan' },
  { id: 'E24', code: 'E24', description: 'Tampilan monitor blur atau kontras rendah', category: 'Tampilan' },
  { id: 'E25', code: 'E25', description: 'Komputer tiba-tiba mati sendiri', category: 'Daya' },
  { id: 'E26', code: 'E26', description: 'Komputer freeze / tidak merespon', category: 'Performa' },
  { id: 'E27', code: 'E27', description: 'Proses loading sangat lambat', category: 'Penyimpanan' },
  { id: 'E28', code: 'E28', description: 'Suhu PC menjadi sangat panas (overheat)', category: 'Pendingin' },
];

export const defaultComponents: Component[] = [
  { id: '1', name: 'VGA Card', description: 'Kartu grafis untuk mengolah dan menampilkan visual', icon: 'Monitor' },
  { id: '2', name: 'Power Supply', description: 'Unit sumber daya yang mengkonversi listrik AC ke DC', icon: 'Zap' },
  { id: '3', name: 'RAM', description: 'Random Access Memory, memori kerja sementara komputer', icon: 'MemoryStick' },
  { id: '4', name: 'Harddisk', description: 'Media penyimpanan data permanen komputer', icon: 'HardDrive' },
  { id: '5', name: 'Motherboard', description: 'Papan induk yang menghubungkan semua komponen', icon: 'CircuitBoard' },
  { id: '6', name: 'Processor', description: 'Unit pemroses pusat (CPU) komputer', icon: 'Cpu' },
  { id: '7', name: 'Monitor', description: 'Layar tampilan output visual komputer', icon: 'Monitor' },
  { id: '8', name: 'Overheat', description: 'Kondisi suhu berlebih pada komponen PC', icon: 'Thermometer' },
];

export const defaultKBRelations: KBRelation[] = [
  // VGA Card
  { symptomCode: 'E01', componentName: 'VGA Card', cfValue: 0.8 },
  { symptomCode: 'E14', componentName: 'VGA Card', cfValue: 0.9 },
  { symptomCode: 'E15', componentName: 'VGA Card', cfValue: 1.0 },
  { symptomCode: 'E16', componentName: 'VGA Card', cfValue: 0.7 },
  { symptomCode: 'E22', componentName: 'VGA Card', cfValue: 0.6 },
  { symptomCode: 'E23', componentName: 'VGA Card', cfValue: 0.7 },
  { symptomCode: 'E24', componentName: 'VGA Card', cfValue: 0.5 },
  // Power Supply
  { symptomCode: 'E02', componentName: 'Power Supply', cfValue: 0.6 },
  { symptomCode: 'E04', componentName: 'Power Supply', cfValue: 0.9 },
  { symptomCode: 'E06', componentName: 'Power Supply', cfValue: 0.7 },
  { symptomCode: 'E25', componentName: 'Power Supply', cfValue: 0.8 },
  { symptomCode: 'E26', componentName: 'Power Supply', cfValue: 0.6 },
  // RAM
  { symptomCode: 'E03', componentName: 'RAM', cfValue: 0.8 },
  { symptomCode: 'E07', componentName: 'RAM', cfValue: 0.7 },
  { symptomCode: 'E11', componentName: 'RAM', cfValue: 0.9 },
  { symptomCode: 'E12', componentName: 'RAM', cfValue: 0.8 },
  { symptomCode: 'E17', componentName: 'RAM', cfValue: 0.6 },
  { symptomCode: 'E26', componentName: 'RAM', cfValue: 0.5 },
  // Harddisk
  { symptomCode: 'E08', componentName: 'Harddisk', cfValue: 0.8 },
  { symptomCode: 'E13', componentName: 'Harddisk', cfValue: 0.6 },
  { symptomCode: 'E18', componentName: 'Harddisk', cfValue: 0.9 },
  { symptomCode: 'E19', componentName: 'Harddisk', cfValue: 1.0 },
  { symptomCode: 'E20', componentName: 'Harddisk', cfValue: 0.9 },
  { symptomCode: 'E21', componentName: 'Harddisk', cfValue: 0.8 },
  { symptomCode: 'E27', componentName: 'Harddisk', cfValue: 0.7 },
  // Motherboard
  { symptomCode: 'E04', componentName: 'Motherboard', cfValue: 0.7 },
  { symptomCode: 'E05', componentName: 'Motherboard', cfValue: 0.8 },
  { symptomCode: 'E10', componentName: 'Motherboard', cfValue: 0.7 },
  { symptomCode: 'E12', componentName: 'Motherboard', cfValue: 0.6 },
  // Processor
  { symptomCode: 'E06', componentName: 'Processor', cfValue: 0.8 },
  { symptomCode: 'E09', componentName: 'Processor', cfValue: 0.7 },
  { symptomCode: 'E28', componentName: 'Processor', cfValue: 0.9 },
  // Monitor
  { symptomCode: 'E22', componentName: 'Monitor', cfValue: 0.8 },
  { symptomCode: 'E23', componentName: 'Monitor', cfValue: 0.9 },
  { symptomCode: 'E24', componentName: 'Monitor', cfValue: 0.9 },
  // Overheat
  { symptomCode: 'E25', componentName: 'Overheat', cfValue: 0.7 },
  { symptomCode: 'E26', componentName: 'Overheat', cfValue: 0.8 },
  { symptomCode: 'E28', componentName: 'Overheat', cfValue: 1.0 },
];

// Mock diagnosis history
export const mockHistory: DiagnosisHistory[] = [
  {
    id: '1', date: '2026-05-10 14:32', symptoms: ['E15', 'E01', 'E14'],
    mainDiagnosis: 'VGA Card', confidence: 100,
    allResults: [{ component: 'VGA Card', cfValue: 100 }, { component: 'Monitor', cfValue: 56 }]
  },
  {
    id: '2', date: '2026-05-10 11:15', symptoms: ['E19', 'E20', 'E18'],
    mainDiagnosis: 'Harddisk', confidence: 100,
    allResults: [{ component: 'Harddisk', cfValue: 100 }, { component: 'RAM', cfValue: 0 }]
  },
  {
    id: '3', date: '2026-05-09 16:44', symptoms: ['E28', 'E25', 'E06'],
    mainDiagnosis: 'Overheat', confidence: 100,
    allResults: [{ component: 'Overheat', cfValue: 100 }, { component: 'Processor', cfValue: 90 }]
  },
  {
    id: '4', date: '2026-05-09 09:20', symptoms: ['E11', 'E12', 'E03'],
    mainDiagnosis: 'RAM', confidence: 99,
    allResults: [{ component: 'RAM', cfValue: 99 }, { component: 'Motherboard', cfValue: 60 }]
  },
  {
    id: '5', date: '2026-05-08 15:05', symptoms: ['E04', 'E25', 'E26'],
    mainDiagnosis: 'Power Supply', confidence: 96,
    allResults: [{ component: 'Power Supply', cfValue: 96 }, { component: 'Overheat', cfValue: 94 }]
  },
  {
    id: '6', date: '2026-05-08 10:11', symptoms: ['E23', 'E22', 'E24'],
    mainDiagnosis: 'Monitor', confidence: 99,
    allResults: [{ component: 'Monitor', cfValue: 99 }, { component: 'VGA Card', cfValue: 86 }]
  },
  {
    id: '7', date: '2026-05-07 13:30', symptoms: ['E05', 'E10', 'E04'],
    mainDiagnosis: 'Motherboard', confidence: 95,
    allResults: [{ component: 'Motherboard', cfValue: 95 }, { component: 'Power Supply', cfValue: 90 }]
  },
  {
    id: '8', date: '2026-05-07 08:50', symptoms: ['E06', 'E09', 'E28'],
    mainDiagnosis: 'Processor', confidence: 99,
    allResults: [{ component: 'Processor', cfValue: 99 }, { component: 'Overheat', cfValue: 100 }]
  },
  {
    id: '9', date: '2026-05-06 17:22', symptoms: ['E19', 'E27', 'E08'],
    mainDiagnosis: 'Harddisk', confidence: 100,
    allResults: [{ component: 'Harddisk', cfValue: 100 }]
  },
  {
    id: '10', date: '2026-05-06 12:00', symptoms: ['E26', 'E17', 'E11'],
    mainDiagnosis: 'RAM', confidence: 90,
    allResults: [{ component: 'RAM', cfValue: 90 }, { component: 'Overheat', cfValue: 80 }]
  },
];

// localStorage helpers
export function getSymptoms(): Symptom[] {
  try {
    const raw = localStorage.getItem('admin_symptoms');
    return raw ? JSON.parse(raw) : defaultSymptoms;
  } catch { return defaultSymptoms; }
}
export function saveSymptoms(data: Symptom[]) {
  localStorage.setItem('admin_symptoms', JSON.stringify(data));
}

export function getComponents(): Component[] {
  try {
    const raw = localStorage.getItem('admin_components');
    return raw ? JSON.parse(raw) : defaultComponents;
  } catch { return defaultComponents; }
}
export function saveComponents(data: Component[]) {
  localStorage.setItem('admin_components', JSON.stringify(data));
}

export function getKBRelations(): KBRelation[] {
  try {
    const raw = localStorage.getItem('admin_kb');
    return raw ? JSON.parse(raw) : defaultKBRelations;
  } catch { return defaultKBRelations; }
}
export function saveKBRelations(data: KBRelation[]) {
  localStorage.setItem('admin_kb', JSON.stringify(data));
}

export function getHistory(): DiagnosisHistory[] {
  return mockHistory;
}
