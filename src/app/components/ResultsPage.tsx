import { CheckCircle2, AlertCircle, ChevronLeft, RotateCcw, Cpu, AlertTriangle, Info, HardDrive, MemoryStick, Monitor, Zap, CircuitBoard, Thermometer } from 'lucide-react';

interface DiagnosisResult {
  component: string;
  cfValue: number;
}

interface ResultsPageProps {
  results: DiagnosisResult[];
  mainDiagnosis: string;
  confidence: number;
  onBack: () => void;
  onReset: () => void;
}

const componentIcons: Record<string, React.ElementType> = {
  'VGA Card': Monitor,
  'Power Supplay': Zap,
  'RAM': MemoryStick,
  'Harddisk': HardDrive,
  'Motherboard': CircuitBoard,
  'Processor': Cpu,
  'Monitor': Monitor,
  'Overheat': Thermometer,
};

const componentColors: Record<string, { bg: string; icon: string; bar: string; border: string }> = {
  'VGA Card':     { bg: 'bg-purple-50', icon: 'text-purple-600 bg-purple-100', bar: 'bg-purple-500', border: 'border-purple-200' },
  'Power Supplay': { bg: 'bg-yellow-50', icon: 'text-yellow-600 bg-yellow-100', bar: 'bg-yellow-500', border: 'border-yellow-200' },
  'RAM':          { bg: 'bg-green-50',  icon: 'text-green-600 bg-green-100',   bar: 'bg-green-500',  border: 'border-green-200' },
  'Harddisk':     { bg: 'bg-blue-50',   icon: 'text-blue-600 bg-blue-100',     bar: 'bg-blue-500',   border: 'border-blue-200' },
  'Motherboard':  { bg: 'bg-red-50',    icon: 'text-red-600 bg-red-100',       bar: 'bg-red-500',    border: 'border-red-200' },
  'Processor':    { bg: 'bg-orange-50', icon: 'text-orange-600 bg-orange-100', bar: 'bg-orange-500', border: 'border-orange-200' },
  'Monitor':      { bg: 'bg-cyan-50',   icon: 'text-cyan-600 bg-cyan-100',     bar: 'bg-cyan-500',   border: 'border-cyan-200' },
  'Overheat':     { bg: 'bg-rose-50',   icon: 'text-rose-600 bg-rose-100',     bar: 'bg-rose-500',   border: 'border-rose-200' },
};

const recommendations: Record<string, string[]> = {
  'VGA Card': [
    'Bersihkan slot PCIe dan pasang ulang VGA card dengan benar',
    'Periksa apakah konektor daya tambahan VGA sudah terpasang',
    'Update atau reinstall driver VGA terbaru',
    'Coba gunakan VGA onboard sementara untuk memastikan kerusakan',
    'Jika VGA overheating, bersihkan kipas dan thermal paste',
  ],
  'Power Supplay': [
    'Periksa sambungan kabel listrik dari PSU ke komponen',
    'Ukur tegangan PSU menggunakan multimeter (12V, 5V, 3.3V)',
    'Ganti PSU jika tegangan tidak stabil atau di bawah standar',
    'Pastikan kapasitas watt PSU mencukupi kebutuhan komputer',
    'Periksa kabel dan konektor PSU dari kerusakan fisik',
  ],
  'RAM': [
    'Lepas dan pasang kembali modul RAM dengan benar',
    'Bersihkan pin RAM menggunakan penghapus pensil lembut',
    'Coba gunakan satu slot RAM untuk mengisolasi masalah',
    'Jalankan tes memori menggunakan MemTest86',
    'Pastikan RAM kompatibel dengan spesifikasi motherboard',
  ],
  'Harddisk': [
    'Periksa kabel SATA dan konektor power harddisk',
    'Jalankan CHKDSK untuk memeriksa dan memperbaiki bad sector',
    'Backup data penting segera sebelum melakukan perbaikan',
    'Cek S.M.A.R.T data harddisk untuk mendeteksi kerusakan dini',
    'Pertimbangkan upgrade ke SSD untuk performa lebih baik',
  ],
  'Motherboard': [
    'Periksa semua konektor dan kabel yang terhubung ke motherboard',
    'Periksa kondisi kapasitor pada motherboard secara visual',
    'Reset BIOS/CMOS dengan melepas baterai CMOS selama 5 menit',
    'Cek apakah ada komponen yang menempel atau korosif',
    'Konsultasikan dengan teknisi profesional untuk kerusakan serius',
  ],
  'Processor': [
    'Bersihkan dan ganti thermal paste pada processor',
    'Pastikan cooler processor terpasang dengan kuat dan rata',
    'Periksa socket processor dari bengkoknya pin',
    'Monitor suhu CPU menggunakan software HWMonitor',
    'Pastikan voltase CPU sesuai dengan spesifikasi di BIOS',
  ],
  'Monitor': [
    'Periksa dan ganti kabel video (HDMI/VGA/DisplayPort)',
    'Coba hubungkan ke monitor lain untuk memastikan sumber masalah',
    'Periksa dan atur brightness, contrast, dan refresh rate',
    'Periksa apakah backlight monitor masih berfungsi',
    'Cek pengaturan resolusi di Device Manager',
  ],
  'Overheat': [
    'Bersihkan debu dari semua kipas dan heatsink dengan udara bertekanan',
    'Ganti thermal paste pada CPU dan GPU jika sudah kering',
    'Pastikan sirkulasi udara casing komputer optimal',
    'Tambahkan case fan tambahan jika suhu masih tinggi',
    'Periksa apakah semua kipas berputar dengan normal',
  ],
};

function getConfidenceLevel(cf: number): { label: string; color: string; bg: string; icon: React.ElementType } {
  if (cf >= 75) return { label: 'Sangat Tinggi', color: 'text-green-700', bg: 'bg-green-500', icon: CheckCircle2 };
  if (cf >= 50) return { label: 'Tinggi', color: 'text-blue-700', bg: 'bg-blue-500', icon: CheckCircle2 };
  if (cf >= 30) return { label: 'Sedang', color: 'text-yellow-700', bg: 'bg-yellow-500', icon: AlertCircle };
  return { label: 'Rendah', color: 'text-red-700', bg: 'bg-red-500', icon: AlertTriangle };
}

function getBarColor(cf: number): string {
  if (cf >= 75) return 'bg-green-500';
  if (cf >= 50) return 'bg-blue-500';
  if (cf >= 30) return 'bg-yellow-500';
  return 'bg-red-400';
}

export function ResultsPage({ results, mainDiagnosis, confidence, onBack, onReset }: ResultsPageProps) {
  const level = getConfidenceLevel(confidence);
  const LevelIcon = level.icon;
  const MainIcon = componentIcons[mainDiagnosis] || Cpu;
  const mainColor = componentColors[mainDiagnosis] || { bg: 'bg-blue-50', icon: 'text-blue-600 bg-blue-100', bar: 'bg-blue-500', border: 'border-blue-200' };
  const mainRecs = recommendations[mainDiagnosis] || [];
  const topResults = results.filter(r => r.cfValue > 0);

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
                <span className="hidden sm:inline">Kembali ke Diagnosis</span>
              </button>
              <div className="w-px h-6 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">SiPakarPC</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-lg text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Diagnosis Ulang
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Hasil Diagnosis</h1>
          <p className="text-gray-500">Analisis selesai — berikut hasil diagnosis kerusakan PC Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Main Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Diagnosis Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`${mainColor.bg} border-b ${mainColor.border} p-6`}>
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${mainColor.icon}`}>
                    <MainIcon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Kerusakan Utama Terdeteksi</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{mainDiagnosis}</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <LevelIcon className={`w-4 h-4 ${level.color}`} />
                        <span className={`text-sm font-semibold ${level.color}`}>Keyakinan: {confidence}%</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${level.color} bg-white border border-current`}>
                        {level.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-5xl font-bold ${level.color}`}>{confidence}%</p>
                    <p className="text-xs text-gray-400 mt-1">Certainty Factor</p>
                  </div>
                </div>
                {/* CF Bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="bg-white/60 rounded-full h-3 relative">
                    <div
                      className={`${mainColor.bar} rounded-full h-3 transition-all duration-700`}
                      style={{ width: `${confidence}%` }}
                    />
                    <div className="absolute top-0 left-1/2 w-px h-3 bg-gray-400/50" />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Rekomendasi Perbaikan untuk {mainDiagnosis}
                </h3>
                <div className="space-y-3">
                  {mainRecs.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>

                {confidence < 50 && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Tingkat keyakinan rendah</p>
                      <p className="text-xs text-amber-700 mt-1">Pertimbangkan untuk melakukan diagnosis ulang dengan gejala yang lebih spesifik, atau konsultasikan langsung dengan teknisi komputer.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* All Components Analysis */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-5">Analisis Semua Komponen</h3>
              <div className="space-y-4">
                {results.map((result, index) => {
                  const colors = componentColors[result.component] || { icon: 'text-gray-500 bg-gray-100', bar: 'bg-gray-400', border: '' };
                  const IconComp = componentIcons[result.component] || Cpu;
                  const barColor = getBarColor(result.cfValue);
                  const isMain = result.component === mainDiagnosis;
                  return (
                    <div
                      key={result.component}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                        isMain ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-gray-400 text-xs font-bold w-5 text-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className={`text-sm font-medium ${isMain ? 'text-blue-800' : 'text-gray-800'}`}>
                            {result.component}
                            {isMain && <span className="ml-2 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Utama</span>}
                          </p>
                          <span className={`text-sm font-bold ${
                            result.cfValue >= 75 ? 'text-green-600' :
                            result.cfValue >= 50 ? 'text-blue-600' :
                            result.cfValue >= 30 ? 'text-yellow-600' :
                            result.cfValue > 0  ? 'text-red-500' :
                            'text-gray-400'
                          }`}>
                            {result.cfValue}%
                          </span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2">
                          <div
                            className={`${barColor} rounded-full h-2 transition-all duration-700`}
                            style={{ width: `${result.cfValue}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Diagnosis</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Komponen Bermasalah</span>
                  <span className="text-sm font-semibold text-gray-900">{mainDiagnosis}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Nilai CF</span>
                  <span className={`text-sm font-bold ${level.color}`}>{confidence}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Tingkat Keyakinan</span>
                  <span className={`text-sm font-semibold ${level.color}`}>{level.label}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Komponen Positif</span>
                  <span className="text-sm font-semibold text-gray-900">{topResults.length} komponen</span>
                </div>
              </div>
            </div>

            {/* Top 3 Suspects */}
            {topResults.slice(0, 3).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Top 3 Komponen Dicurigai</h3>
                <div className="space-y-3">
                  {topResults.slice(0, 3).map((r, i) => {
                    const colors = componentColors[r.component] || { icon: 'text-gray-500 bg-gray-100' };
                    const IconComp = componentIcons[r.component] || Cpu;
                    const medals = ['🥇', '🥈', '🥉'];
                    return (
                      <div key={r.component} className="flex items-center gap-3">
                        <span className="text-lg">{medals[i]}</span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.icon}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{r.component}</p>
                          <p className="text-xs text-gray-400">CF: {r.cfValue}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Advice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Saran Umum
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Backup data penting sebelum perbaikan
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Matikan komputer dari listrik sebelum membuka casing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Gunakan gelang anti-static saat menyentuh komponen
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Konsultasikan dengan teknisi profesional jika ragu
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Diagnosis Ulang
              </button>
              <button
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Ubah Gejala
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
