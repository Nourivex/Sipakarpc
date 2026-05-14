import { Monitor, Cpu, HardDrive, Zap, MemoryStick, Thermometer, CircuitBoard, CheckCircle2, Search, BarChart3, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onStart: () => void;
  onGoAdmin: () => void;
}

const pcComponents = [
  { name: 'VGA Card', icon: Monitor, color: 'bg-purple-100 text-purple-600', desc: 'Kartu grafis untuk tampilan visual' },
  { name: 'Power Supply', icon: Zap, color: 'bg-yellow-100 text-yellow-600', desc: 'Sumber daya listrik komputer' },
  { name: 'RAM', icon: MemoryStick, color: 'bg-green-100 text-green-600', desc: 'Memori kerja sementara' },
  { name: 'Harddisk', icon: HardDrive, color: 'bg-blue-100 text-blue-600', desc: 'Penyimpanan data permanen' },
  { name: 'Motherboard', icon: CircuitBoard, color: 'bg-red-100 text-red-600', desc: 'Papan induk utama komputer' },
  { name: 'Processor', icon: Cpu, color: 'bg-orange-100 text-orange-600', desc: 'Otak pemroses komputer' },
  { name: 'Monitor', icon: Monitor, color: 'bg-cyan-100 text-cyan-600', desc: 'Layar tampilan output' },
  { name: 'Overheat', icon: Thermometer, color: 'bg-rose-100 text-rose-600', desc: 'Masalah suhu berlebihan' },
];

const features = [
  {
    icon: Search,
    title: 'Diagnosis Cerdas',
    desc: 'Gunakan metode Certainty Factor untuk menghitung tingkat keyakinan diagnosis secara ilmiah.',
    color: 'bg-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Hasil Terperinci',
    desc: 'Dapatkan analisis lengkap semua komponen PC beserta nilai CF (Certainty Factor).',
    color: 'bg-indigo-500',
  },
  {
    icon: Shield,
    title: 'Rekomendasi Solusi',
    desc: 'Sistem memberikan rekomendasi perbaikan spesifik untuk setiap komponen yang terdeteksi.',
    color: 'bg-violet-500',
  },
  {
    icon: Clock,
    title: 'Cepat & Mudah',
    desc: 'Hanya perlu memilih gejala yang dialami, sistem akan langsung memproses diagnosis.',
    color: 'bg-sky-500',
  },
];

const steps = [
  { num: 1, title: 'Pilih Gejala', desc: 'Centang semua gejala kerusakan yang dialami komputer Anda dari 28 gejala yang tersedia.' },
  { num: 2, title: 'Proses Diagnosis', desc: 'Klik tombol Diagnosis dan sistem akan menganalisis menggunakan metode Certainty Factor.' },
  { num: 3, title: 'Lihat Hasil', desc: 'Baca hasil diagnosis lengkap dengan tingkat keyakinan dan rekomendasi perbaikan.' },
];

export function HomePage({ onStart, onGoAdmin }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-gray-900 font-semibold text-lg">SiPakar</span>
              <span className="text-blue-600 font-semibold text-lg">PC</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Fitur</a>
            <a href="#komponen" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Komponen</a>
            <a href="#cara-pakai" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Cara Pakai</a>
            <button
              onClick={onStart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Mulai Diagnosis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/50 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
                <Star className="w-3.5 h-3.5 fill-blue-300 text-blue-300" />
                Berbasis Metode Certainty Factor
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Sistem Pakar<br />
                <span className="text-blue-300">Diagnosis Kerusakan</span><br />
                Komputer PC
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Alat bantu pintar untuk mendiagnosis kerusakan komputer Anda secara akurat. Cukup pilih gejala yang dialami, sistem akan langsung menganalisis komponen yang bermasalah.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStart}
                  className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Mulai Diagnosis Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#cara-pakai"
                  className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                >
                  Pelajari Cara Pakai
                </a>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-white">8</p>
                  <p className="text-blue-300 text-sm">Komponen PC</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">28</p>
                  <p className="text-blue-300 text-sm">Gejala Kerusakan</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">CF</p>
                  <p className="text-blue-300 text-sm">Metode Ilmiah</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-xl" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760708825878-9e7ecf31565a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQQyUyMGNvbXB1dGVyJTIwaGFyZHdhcmUlMjBjb21wb25lbnRzJTIwZGVza3RvcHxlbnwxfHx8fDE3NzgzODExNjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="PC Hardware Components"
                  className="relative z-10 rounded-3xl shadow-2xl w-full h-80 object-cover"
                />
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 z-20">
                  <p className="text-xs text-gray-500">Tingkat Keyakinan</p>
                  <p className="text-2xl font-bold text-green-600">95%</p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 z-20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Diagnosis Selesai</p>
                      <p className="text-sm font-semibold text-gray-800">VGA Card Rusak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Keunggulan Sistem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dibangun dengan teknologi sistem pakar menggunakan metode Certainty Factor yang terbukti akurat untuk mendiagnosis kerusakan komputer</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PC Components Section */}
      <section id="komponen" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Komponen yang Didiagnosis</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Sistem mampu mendeteksi kerusakan pada 8 komponen utama PC Anda berdasarkan 28 gejala berbeda</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {pcComponents.map((comp, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 cursor-default"
              >
                <div className={`w-12 h-12 ${comp.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <comp.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{comp.name}</h3>
                <p className="text-xs text-gray-500">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How To Use Section */}
      <section id="cara-pakai" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cara Menggunakan</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Hanya 3 langkah mudah untuk mendapatkan diagnosis kerusakan PC Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-blue-200" style={{ left: '18%', right: '18%' }} />
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 relative z-10">
                  <span className="text-white text-2xl font-bold">{step.num}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Mendiagnosis PC Anda?</h2>
          <p className="text-blue-100 mb-8 text-lg">Mulai sekarang secara gratis — tidak perlu mendaftar, langsung gunakan!</p>
          <button
            onClick={onStart}
            className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3 group"
          >
            Mulai Diagnosis Sekarang
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">SiPakarPC</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Sistem Pakar Diagnosis Kerusakan PC &bull; Metode Certainty Factor &bull; 8 Komponen &bull; 28 Gejala
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-sm">© 2026 SiPakarPC</p>
              <button
                onClick={onGoAdmin}
                className="text-gray-500 hover:text-gray-300 text-xs underline underline-offset-2 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}