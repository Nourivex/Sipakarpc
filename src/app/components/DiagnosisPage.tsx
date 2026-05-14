import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Cpu, AlertCircle, CheckCircle2, X, ClipboardList } from 'lucide-react';
import { Symptom, getSymptoms, USER_CERTAINTY_LEVELS } from '../data/adminStore';

interface DiagnosisPageProps {
  onBack: () => void;
  onDiagnose: (selected: { code: string; certainty: number }[]) => void;
}

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
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    async function load() {
      const data = await getSymptoms();
      setSymptoms(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggleSymptom = (code: string) => {
    setSelectedMap(prev => {
      const next = { ...prev };
      if (next[code] !== undefined) {
        delete next[code];
      } else {
        next[code] = 1.0; // Default to "Sangat Yakin"
      }
      return next;
    });
  };

  const handleCertaintyChange = (code: string, val: number) => {
    setSelectedMap(prev => ({ ...prev, [code]: val }));
  };

  const handleDiagnose = () => {
    const selected = Object.entries(selectedMap).map(([code, certainty]) => ({ code, certainty }));
    if (selected.length === 0) return;
    onDiagnose(selected);
  };

  const handleClearAll = () => setSelectedMap({});

  const categories = ['Semua', ...Array.from(new Set(symptoms.map(s => s.category)))];

  const filteredSymptoms = symptoms.filter(s => {
    const matchCat = activeCategory === 'Semua' || s.category === activeCategory;
    const matchSearch = s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const selectedCount = Object.keys(selectedMap).length;

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat gejala...</div>;

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
            {selectedCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">{selectedCount} gejala dipilih</span>
                <button
                  onClick={handleDiagnose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm"
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Diagnosis Kerusakan PC</h1>
          <p className="text-gray-500 max-w-2xl">Pilih gejala yang dialami komputer Anda dan tentukan tingkat keyakinan Anda terhadap gejala tersebut untuk hasil yang lebih akurat.</p>
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
                  placeholder="Cari gejala (misal: bluescreen, lambat, beep)..."
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
            <div className="space-y-3">
              {filteredSymptoms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada gejala ditemukan</p>
                </div>
              ) : (
                filteredSymptoms.map(symptom => {
                  const isSelected = selectedMap[symptom.code] !== undefined;
                  return (
                    <div
                      key={symptom.code}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 shadow-sm'
                          : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <label className="flex items-center gap-4 cursor-pointer flex-1 min-w-0">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
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
                            onChange={() => handleToggleSymptom(symptom.code)}
                            className="hidden"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                              }`}>
                                {symptom.code}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${categoryColors[symptom.category]}`}>
                                {symptom.category}
                              </span>
                            </div>
                            <p className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                              {symptom.description}
                            </p>
                          </div>
                        </label>

                        {isSelected && (
                          <div className="w-40 flex-shrink-0">
                            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1.5 px-1">Keyakinan Anda:</p>
                            <select
                              value={selectedMap[symptom.code]}
                              onChange={(e) => handleCertaintyChange(symptom.code, parseFloat(e.target.value))}
                              className="w-full bg-white border border-blue-200 text-blue-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              {USER_CERTAINTY_LEVELS.map(lvl => (
                                <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar: Selected Symptoms */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Warning if empty */}
              {selectedCount === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Belum ada gejala dipilih</p>
                  <p className="text-gray-400 text-xs">Pilih minimal 1 gejala untuk memulai diagnosis</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-blue-600 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">Gejala Dipilih</p>
                        <p className="text-blue-200 text-xs">{selectedCount} gejala aktif</p>
                      </div>
                      <button
                        onClick={handleClearAll}
                        className="text-blue-200 hover:text-white text-xs transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Hapus Semua
                      </button>
                    </div>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
                    {symptoms.filter(s => selectedMap[s.code] !== undefined).map(s => (
                      <div key={s.code} className="flex items-start gap-3 group border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-700 leading-snug line-clamp-2">{s.description}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] font-bold text-blue-600">
                              {USER_CERTAINTY_LEVELS.find(l => l.value === selectedMap[s.code])?.label}
                            </span>
                            <button
                              onClick={() => handleToggleSymptom(s.code)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnose Button */}
              <div className="mt-4">
                <button
                  onClick={handleDiagnose}
                  disabled={selectedCount === 0}
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                    selectedCount === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ClipboardList className="w-5 h-5" />
                  {selectedCount === 0 ? 'Pilih Gejala Dahulu' : 'Mulai Diagnosis'}
                </button>
              </div>

              {/* Info card */}
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-1">Tips Diagnosis Akurat</p>
                    <p className="text-xs text-amber-700 leading-relaxed">Berikan tingkat keyakinan yang jujur. "Sangat Yakin" (1.0) jika gejala tersebut pasti terjadi, atau tingkatan lain jika Anda ragu.</p>
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
