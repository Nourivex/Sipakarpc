import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Clock, CheckCircle2, Filter } from 'lucide-react';
import { getHistory, getSymptoms, DiagnosisHistory } from '../../data/adminStore';

const componentColors: Record<string, string> = {
  'VGA Card': 'bg-purple-100 text-purple-700',
  'Power Supply': 'bg-yellow-100 text-yellow-700',
  'RAM': 'bg-green-100 text-green-700',
  'Harddisk': 'bg-blue-100 text-blue-700',
  'Motherboard': 'bg-red-100 text-red-700',
  'Processor': 'bg-orange-100 text-orange-700',
  'Monitor': 'bg-cyan-100 text-cyan-700',
  'Overheat': 'bg-rose-100 text-rose-700',
};

function confidenceBadge(cf: number) {
  if (cf >= 75) return 'bg-green-100 text-green-700 border-green-200';
  if (cf >= 50) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (cf >= 30) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

function confidenceLabel(cf: number) {
  if (cf >= 75) return 'Sangat Tinggi';
  if (cf >= 50) return 'Tinggi';
  if (cf >= 30) return 'Sedang';
  return 'Rendah';
}

export function AdminHistory() {
  const history = getHistory();
  const symptoms = getSymptoms();

  const [search, setSearch] = useState('');
  const [filterComp, setFilterComp] = useState('Semua');
  const [expanded, setExpanded] = useState<string | null>(null);

  const getSymptomDesc = (code: string) => symptoms.find(s => s.code === code)?.description || code;

  const uniqueComponents = Array.from(new Set(history.map(h => h.mainDiagnosis)));

  const filtered = history.filter(h => {
    const matchComp = filterComp === 'Semua' || h.mainDiagnosis === filterComp;
    const matchSearch = h.mainDiagnosis.toLowerCase().includes(search.toLowerCase())
      || h.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchComp && matchSearch;
  });

  const stats = {
    total: history.length,
    highConf: history.filter(h => h.confidence >= 75).length,
    avgConf: Math.round(history.reduce((a, b) => a + b.confidence, 0) / history.length),
    mostCommon: (() => {
      const freq = history.reduce<Record<string, number>>((acc, h) => {
        acc[h.mainDiagnosis] = (acc[h.mainDiagnosis] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    })(),
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Diagnosis</h1>
        <p className="text-gray-500 text-sm mt-1">Log semua sesi diagnosis yang pernah dilakukan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Total Sesi</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Keyakinan Tinggi</p>
          <p className="text-3xl font-bold text-green-600">{stats.highConf}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Rata-rata CF</p>
          <p className="text-3xl font-bold text-blue-600">{stats.avgConf}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Paling Sering</p>
          <p className="text-lg font-bold text-purple-600 truncate">{stats.mostCommon}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari diagnosis atau kode gejala..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterComp}
            onChange={e => setFilterComp(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Semua Komponen</option>
            {uniqueComponents.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Tidak ada riwayat ditemukan</p>
          </div>
        ) : (
          filtered.map(h => {
            const isOpen = expanded === h.id;
            return (
              <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header Row */}
                <button
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setExpanded(isOpen ? null : h.id)}
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{h.mainDiagnosis}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${componentColors[h.mainDiagnosis] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {h.symptoms.length} gejala
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{h.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-bold ${h.confidence >= 75 ? 'text-green-600' : h.confidence >= 50 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        {h.confidence}%
                      </p>
                      <p className="text-xs text-gray-400">{confidenceLabel(h.confidence)}</p>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </button>

                {/* Expanded Detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gejala yang Dipilih</p>
                      <div className="flex flex-wrap gap-2">
                        {h.symptoms.map(code => (
                          <div key={code} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2.5 py-1.5 text-xs">
                            <span className="font-bold">{code}</span>
                            <span className="text-blue-500">—</span>
                            <span className="text-blue-600 max-w-48 truncate">{getSymptomDesc(code)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hasil Diagnosis</p>
                      <div className="space-y-2">
                        {h.allResults.sort((a, b) => b.cfValue - a.cfValue).map(r => (
                          <div key={r.component} className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-md font-medium min-w-24 text-center ${componentColors[r.component] || 'bg-gray-100 text-gray-600'}`}>
                              {r.component}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div
                                className={`rounded-full h-2 transition-all ${r.cfValue >= 75 ? 'bg-green-500' : r.cfValue >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                style={{ width: `${r.cfValue}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold min-w-12 text-right ${r.cfValue >= 75 ? 'text-green-600' : r.cfValue >= 50 ? 'text-blue-600' : 'text-yellow-600'}`}>
                              {r.cfValue}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${confidenceBadge(h.confidence)}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tingkat Keyakinan: {confidenceLabel(h.confidence)} ({h.confidence}%)
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-center text-xs text-gray-400">Menampilkan {filtered.length} dari {history.length} riwayat diagnosis</p>
    </div>
  );
}
