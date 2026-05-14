import { supabase } from '../../lib/supabase';

// Shared data store for the admin panel
// Migrated to Supabase for persistence

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
  mbValue: number;
  md_value: number; // For SQL compatibility if needed, but let's stick to camelCase in TS
  cfValue?: number; // Calculated: MB - MD
}

// Internal interface for Supabase mapping
interface DBRule {
  symptom_code: string;
  component_name: string;
  mb_value: number;
  md_value: number;
}

export interface DiagnosisHistory {
  id: string;
  date: string;
  symptoms: { code: string; certainty: number }[];
  mainDiagnosis: string;
  confidence: number;
  allResults: { component: string; cfValue: number }[];
}

export const USER_CERTAINTY_LEVELS = [
  { label: 'Sangat Yakin', value: 1.0 },
  { label: 'Yakin', value: 0.8 },
  { label: 'Cukup Yakin', value: 0.6 },
  { label: 'Kurang Yakin', value: 0.4 },
  { label: 'Tidak Tahu', value: 0.2 },
  { label: 'Tidak', value: 0.0 },
];

export const defaultSymptoms: Symptom[] = [
  { id: 'E01', code: 'E01', description: 'There is no display on the computer screen', category: 'Tampilan' },
  { id: 'E02', code: 'E02', description: 'The indicator light on the front panel lights up', category: 'Daya' },
  { id: 'E03', code: 'E03', description: 'Long beeps when the computer is turned on', category: 'Suara & Boot' },
  { id: 'E04', code: 'E04', description: 'A short circuit occurs when the computer is turned on', category: 'Daya' },
  { id: 'E05', code: 'E05', description: 'The operating system is off, the cursor does not appear on the screen', category: 'Sistem' },
  { id: 'E06', code: 'E06', description: 'The processor fan is not running and the processor is not hot', category: 'Pendingin' },
  { id: 'E07', code: 'E07', description: 'The system sounds at startup', category: 'Suara & Boot' },
  { id: 'E08', code: 'E08', description: "SO doesn't want to boot", category: 'Suara & Boot' },
  { id: 'E09', code: 'E09', description: 'Computer performance is slowing down', category: 'Performa' },
  { id: 'E10', code: 'E10', description: 'Computers often restart themselves without restarting', category: 'Sistem' },
  { id: 'E11', code: 'E11', description: 'The monitor suddenly becomes bluescreen', category: 'Tampilan' },
  { id: 'E12', code: 'E12', description: 'The computer fails to boot and beepscomputer filed and sounds beep', category: 'Suara & Boot' },
  { id: 'E13', code: 'E13', description: 'Often fails when installing new software', category: 'Sistem' },
  { id: 'E14', code: 'E14', description: 'Graphic performance is slow when playing games or image editors', category: 'Tampilan' },
  { id: 'E15', code: 'E15', description: 'Can enter bios, but VGA does not work after entering the operating system', category: 'Tampilan' },
  { id: 'E16', code: 'E16', description: 'The resolution and color quality of the monitor is not optimal', category: 'Tampilan' },
  { id: 'E17', code: 'E17', description: 'Windows is often not responding and graphics performance feels heavy', category: 'Performa' },
  { id: 'E18', code: 'E18', description: 'The PC does not react anything and the power indicator does not turn on', category: 'Penyimpanan' },
  { id: 'E19', code: 'E19', description: 'The message "Harddisk Error, Hard Disk Failur" appears on the monitor', category: 'Penyimpanan' },
  { id: 'E20', code: 'E20', description: 'The message "Operating System Not Found" appears on the monitor', category: 'Penyimpanan' },
  { id: 'E21', code: 'E21', description: 'There is no round sound and activity on the hard drive', category: 'Penyimpanan' },
  { id: 'E22', code: 'E22', description: 'The display on the blank monitor is white', category: 'Tampilan' },
  { id: 'E23', code: 'E23', description: "The monitor doesn't turn on at all", category: 'Tampilan' },
  { id: 'E24', code: 'E24', description: 'Color contrast on the monitor is blurry', category: 'Tampilan' },
  { id: 'E25', code: 'E25', description: 'The computer dies suddenly while in use', category: 'Daya' },
  { id: 'E26', code: 'E26', description: 'Computer blank / Freezy', category: 'Performa' },
  { id: 'E27', code: 'E27', description: 'Computer loading starts slowly after being used several hours nonstop', category: 'Penyimpanan' },
  { id: 'E28', code: 'E28', description: 'The temperature on the PC becomes very hot from normal conditions', category: 'Pendingin' },
];

export const defaultComponents: Component[] = [
  { id: '1', name: 'Motherboard', description: 'Papan induk yang menghubungkan semua komponen', icon: 'CircuitBoard' },
  { id: '2', name: 'Processor', description: 'Unit pemroses pusat (CPU) komputer', icon: 'Cpu' },
  { id: '3', name: 'RAM', description: 'Random Access Memory, memori kerja sementara komputer', icon: 'MemoryStick' },
  { id: '4', name: 'VGA Card', description: 'Kartu grafis untuk mengolah dan menampilkan visual', icon: 'Monitor' },
  { id: '5', name: 'Power Supplay', description: 'Unit sumber daya yang mengkonversi listrik AC ke DC', icon: 'Zap' },
  { id: '6', name: 'Harddisk', description: 'Media penyimpanan data permanen komputer', icon: 'HardDrive' },
  { id: '7', name: 'Monitor', description: 'Layar tampilan output visual komputer', icon: 'Monitor' },
  { id: '8', name: 'Overheat', description: 'Kondisi suhu berlebih pada komponen PC', icon: 'Thermometer' },
];

// Based on Table 4 from PDF
export const defaultKBRelations: KBRelation[] = [
  // Motherboard (K1)
  { symptomCode: 'E01', componentName: 'Motherboard', mbValue: 0.80, md_value: 0.50 },
  { symptomCode: 'E02', componentName: 'Motherboard', mbValue: 0.85, md_value: 0.40 },
  { symptomCode: 'E03', componentName: 'Motherboard', mbValue: 0.90, md_value: 0.50 },
  { symptomCode: 'E04', componentName: 'Motherboard', mbValue: 0.70, md_value: 0.50 },
  // Processor (K2)
  { symptomCode: 'E05', componentName: 'Processor', mbValue: 0.80, md_value: 0.50 },
  { symptomCode: 'E06', componentName: 'Processor', mbValue: 0.90, md_value: 0.70 },
  { symptomCode: 'E07', componentName: 'Processor', mbValue: 0.80, md_value: 0.60 },
  { symptomCode: 'E08', componentName: 'Processor', mbValue: 0.85, md_value: 0.60 },
  // RAM (K3)
  { symptomCode: 'E09', componentName: 'RAM', mbValue: 0.85, md_value: 0.50 },
  { symptomCode: 'E10', componentName: 'RAM', mbValue: 0.90, md_value: 0.50 },
  { symptomCode: 'E11', componentName: 'RAM', mbValue: 0.85, md_value: 0.50 },
  { symptomCode: 'E12', componentName: 'RAM', mbValue: 0.85, md_value: 0.50 },
  { symptomCode: 'E13', componentName: 'RAM', mbValue: 0.85, md_value: 0.50 },
  // VGA Card (K4)
  { symptomCode: 'E14', componentName: 'VGA Card', mbValue: 0.95, md_value: 0.60 },
  { symptomCode: 'E15', componentName: 'VGA Card', mbValue: 0.90, md_value: 0.50 },
  { symptomCode: 'E16', componentName: 'VGA Card', mbValue: 0.85, md_value: 0.60 },
  { symptomCode: 'E17', componentName: 'VGA Card', mbValue: 0.80, md_value: 0.50 },
  // Power Supplay (K5)
  { symptomCode: 'E02', componentName: 'Power Supplay', mbValue: 0.85, md_value: 0.50 },
  { symptomCode: 'E04', componentName: 'Power Supplay', mbValue: 0.90, md_value: 0.70 },
  { symptomCode: 'E18', componentName: 'Power Supplay', mbValue: 0.95, md_value: 0.50 },
  // Harddisk (K6)
  { symptomCode: 'E17', componentName: 'Harddisk', mbValue: 0.85, md_value: 0.50 },
  { symptomCode: 'E19', componentName: 'Harddisk', mbValue: 0.95, md_value: 0.60 },
  { symptomCode: 'E20', componentName: 'Harddisk', mbValue: 0.90, md_value: 0.50 },
  { symptomCode: 'E21', componentName: 'Harddisk', mbValue: 0.95, md_value: 0.70 },
  // Monitor (K7)
  { symptomCode: 'E16', componentName: 'Monitor', mbValue: 0.75, md_value: 0.50 },
  { symptomCode: 'E22', componentName: 'Monitor', mbValue: 0.95, md_value: 0.60 },
  { symptomCode: 'E23', componentName: 'Monitor', mbValue: 0.80, md_value: 0.50 },
  { symptomCode: 'E24', componentName: 'Monitor', mbValue: 0.80, md_value: 0.50 },
  // Overhead (K8)
  { symptomCode: 'E25', componentName: 'Overheat', mbValue: 0.90, md_value: 0.50 },
  { symptomCode: 'E26', componentName: 'Overheat', mbValue: 0.90, md_value: 0.70 },
  { symptomCode: 'E27', componentName: 'Overheat', mbValue: 0.90, md_value: 0.50 },
  { symptomCode: 'E28', componentName: 'Overheat', mbValue: 0.95, md_value: 0.70 },
];

// Data Access Functions using Supabase

export async function getSymptoms(): Promise<Symptom[]> {
  const { data, error } = await supabase.from('symptoms').select('*').order('code');
  if (error) {
    console.error('Error fetching symptoms:', error);
    return defaultSymptoms;
  }
  return data as Symptom[];
}

export async function saveSymptom(symptom: Symptom) {
  const { error } = await supabase.from('symptoms').upsert({
    code: symptom.code,
    description: symptom.description,
    category: symptom.category
  });
  if (error) throw error;
}

export async function deleteSymptom(id: string) {
  const { error } = await supabase.from('symptoms').delete().eq('id', id);
  if (error) throw error;
}

export async function getComponents(): Promise<Component[]> {
  const { data, error } = await supabase.from('components').select('*').order('name');
  if (error) {
    console.error('Error fetching components:', error);
    return defaultComponents;
  }
  return data as Component[];
}

export async function saveComponent(component: Component) {
  const { error } = await supabase.from('components').upsert({
    name: component.name,
    description: component.description,
    icon: component.icon
  });
  if (error) throw error;
}

export async function deleteComponent(id: string) {
  const { error } = await supabase.from('components').delete().eq('id', id);
  if (error) throw error;
}

export async function getKBRelations(): Promise<KBRelation[]> {
  const { data, error } = await supabase.from('kb_rules').select('*');
  if (error) {
    console.error('Error fetching KB relations:', error);
    return defaultKBRelations;
  }
  return (data as DBRule[]).map(r => ({
    symptomCode: r.symptom_code,
    componentName: r.component_name,
    mbValue: r.mb_value,
    md_value: r.md_value,
    cfValue: r.mb_value - r.md_value
  }));
}

export async function saveKBRelation(relation: KBRelation) {
  const { error } = await supabase.from('kb_rules').upsert({
    symptom_code: relation.symptomCode,
    component_name: relation.componentName,
    mb_value: relation.mbValue,
    md_value: relation.md_value
  });
  if (error) throw error;
}

export async function deleteKBRelation(symptomCode: string, componentName: string) {
  const { error } = await supabase.from('kb_rules').delete()
    .eq('symptom_code', symptomCode)
    .eq('component_name', componentName);
  if (error) throw error;
}

export async function getHistory(): Promise<DiagnosisHistory[]> {
  const { data, error } = await supabase.from('diagnosis_history').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }
  return data.map(h => ({
    id: h.id,
    date: new Date(h.created_at).toLocaleString(),
    symptoms: h.selected_symptoms,
    mainDiagnosis: h.main_diagnosis,
    confidence: h.confidence,
    allResults: h.all_results
  }));
}

export async function saveHistory(history: Omit<DiagnosisHistory, 'id' | 'date'>) {
  const { error } = await supabase.from('diagnosis_history').insert({
    selected_symptoms: history.symptoms,
    main_diagnosis: history.mainDiagnosis,
    confidence: history.confidence,
    all_results: history.allResults
  });
  if (error) throw error;
}

// Legacy helpers to prevent immediate crashes, though they should be migrated to async/await in components
export function getSymptomsSync(): Symptom[] { return defaultSymptoms; }
export function getComponentsSync(): Component[] { return defaultComponents; }
export function getKBRelationsSync(): KBRelation[] { return defaultKBRelations; }
