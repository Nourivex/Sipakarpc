import { useState } from 'react';
import { ChevronLeft, Search, Cpu, AlertCircle, CheckCircle2, X, ClipboardList } from 'lucide-react';

interface Symptom {
  id: string;
  code: string;
  description: string;
  category: string;
}

interface DiagnosisPageProps {
  onBack: () => void;
  onDiagnose: (selectedSymptoms: string[]) => void;
}

const symptoms: Symptom[] = [
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

const categories = ['Semua', 'Tampilan', 'Daya', 'Suara & Boot', 'Sistem', 'Performa', 'Penyimpanan', 'Pendingin'];

const categoryColors: Record<string, string> = {
  'Tampilan':    'bg-purple-100 text-purple-700 border-purple-200',
  'Daya':        'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Suara & Boot':'bg-blue-100 text-blue-700 border-blue-200',
  'Sistem':      'bg-red-100 text-red-700 border-red-200',
  'Performa':    'bg-orange-100 text-orange-700 border-orange-200',
  'Penyimpanan': 'bg-green-100 text-green-700 border-green-200',
  'Pendingin':   'bg-cyan-100 text-cyan-700 border-cyan-200',
};

export function DiagnosisPage({ onBack, onDiagnose }: DiagnosisPageProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const handleToggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleDiagnose = () => {
    if (selectedSymptoms.length === 0) {
      return;
    }
    onDiagnose(selectedSymptoms);
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
  };

  const filteredSymptoms = symptoms.filter(s => {
    const matchCat = activeCategory === 'Semua' || s.category === activeCategory;
    const matchSearch = s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const selectedList = symptoms.filter(s => selectedSymptoms.includes(s.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Kembali ke Beranda</span>
              </button>
              <div className="w-px h-6 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">SiPakarPC</span>
              </div>
            </div>
            {selectedSymptoms.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{selectedSymptoms.length} gejala dipilih</span>
                <button
                  onClick={handleDiagnose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  Diagnosa Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pilih Gejala Kerusakan PC</h1>
          <p className="text-gray-500">Centang semua gejala yang dialami komputer Anda. Semakin banyak gejala dipilih, semakin akurat hasil diagnosis.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main: Symptom List */}
          <div className="lg:col-span-2">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari gejala..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms Grid */}
            <div className="space-y-2">
              {filteredSymptoms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada gejala ditemukan</p>
                </div>
              ) : (
                filteredSymptoms.map(symptom => {
                  const isSelected = selectedSymptoms.includes(symptom.id);
                  return (
                    <label
                      key={symptom.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all group ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 shadow-sm'
                          : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 shadow-sm'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSymptom(symptom.id)}
                        className="hidden"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                            isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {symptom.code}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-md border ${categoryColors[symptom.category]}`}>
                            {symptom.category}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${isSelected ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                          {symptom.description}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar: Selected Symptoms */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Warning if empty */}
              {selectedSymptoms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Belum ada gejala dipilih</p>
                  <p className="text-gray-400 text-xs">Pilih minimal 1 gejala dari daftar di sebelah kiri</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-blue-600 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">Gejala Dipilih</p>
                        <p className="text-blue-200 text-xs">{selectedSymptoms.length} dari 28 gejala</p>
                      </div>
                      <button
                        onClick={handleClearAll}
                        className="text-blue-200 hover:text-white text-xs transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Hapus Semua
                      </button>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 bg-blue-700 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ width: `${(selectedSymptoms.length / 28) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto space-y-2">
                    {selectedList.map(s => (
                      <div key={s.id} className="flex items-start gap-2 group">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 flex-1">{s.description}</p>
                        <button
                          onClick={() => handleToggleSymptom(s.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnose Button */}
              <div className="mt-4">
                <button
                  onClick={handleDiagnose}
                  disabled={selectedSymptoms.length === 0}
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                    selectedSymptoms.length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ClipboardList className="w-5 h-5" />
                  {selectedSymptoms.length === 0 ? 'Pilih Gejala Dahulu' : 'Mulai Diagnosis'}
                </button>
                {selectedSymptoms.length > 0 && (
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Sistem akan menganalisis {selectedSymptoms.length} gejala yang dipilih
                  </p>
                )}
              </div>

              {/* Info card */}
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-1">Tips Diagnosis Akurat</p>
                    <p className="text-xs text-amber-700 leading-relaxed">Pilih semua gejala yang sesuai kondisi PC Anda. Semakin lengkap gejala dipilih, semakin akurat hasil diagnosis yang diberikan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
