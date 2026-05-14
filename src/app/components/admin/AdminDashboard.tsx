import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity, Cpu, AlertCircle, Database, TrendingUp, Users, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { getHistory, getSymptoms, getComponents, getKBRelations, DiagnosisHistory, Symptom, Component, KBRelation } from '../../data/adminStore';

const confidenceColor = (cf: number) => {
  if (cf >= 75) return 'text-green-600 bg-green-50';
  if (cf >= 50) return 'text-blue-600 bg-blue-50';
  if (cf >= 30) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

export function AdminDashboard() {
  const [history, setHistory] = useState<DiagnosisHistory[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [kbRelations, setKbRelations] = useState<KBRelation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [h, s, c, k] = await Promise.all([
          getHistory(),
          getSymptoms(),
          getComponents(),
          getKBRelations()
        ]);
        setHistory(h);
        setSymptoms(s);
        setComponents(c);
        setKbRelations(k);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate Real Stats
  const totalDiagnosis = history.length;
  const avgConfidence = totalDiagnosis > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.confidence, 0) / totalDiagnosis)
    : 0;

  const componentStats = components.map(comp => ({
    name: comp.name,
    count: history.filter(h => h.mainDiagnosis === comp.name).length,
    fill: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') // Random color for now
  })).sort((a, b) => b.count - a.count);

  const pieData = componentStats.filter(c => c.count > 0);

  // Group trend by date
  const trendMap = history.reduce((acc: any, curr) => {
    const d = curr.date.split(',')[0]; // Simple date grouping
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const trendData = Object.entries(trendMap).map(([day, count]) => ({ day, count })).slice(-7);

  const statCards = [
    { label: 'Total Diagnosis', value: String(totalDiagnosis), change: 'Sesi tersimpan', icon: Activity, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Rata-rata CF', value: `${avgConfidence}%`, change: 'Tingkat keyakinan', icon: ShieldCheck, color: 'bg-green-500', light: 'bg-green-50 text-green-600' },
    { label: 'Total Gejala', value: String(symptoms.length), change: 'Basis data', icon: AlertCircle, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
    { label: 'Rules Pakar', value: String(kbRelations.length), change: 'Relasi MB/MD', icon: Database, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600' },
  ];

  if (loading) return <div className="p-12 text-center flex flex-col items-center gap-3">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-500 font-medium">Menganalisis data sistem pakar...</p>
  </div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ringkasan</h1>
          <p className="text-gray-500 text-sm mt-1">Status sistem diagnosis hardware PC saat ini</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">Pembaruan Terakhir: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.change}</p>
              </div>
              <div className={`w-12 h-12 ${s.light} rounded-xl flex items-center justify-center shadow-inner`}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Tren Penggunaan Sistem</h2>
              <p className="text-xs text-gray-400">Log harian aktivitas diagnosis</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData.length > 0 ? trendData : [{ day: 'No Data', count: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} name="Diagnosis" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="font-bold text-gray-900">Distribusi Kerusakan</h2>
            <p className="text-xs text-gray-400">Komponen yang paling sering bermasalah</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={5} nameKey="name">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke="rgba(255,255,255,0.2)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '11px' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm italic">Belum ada data untuk ditampilkan</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="font-bold text-gray-900">Analisis per Komponen</h2>
            <p className="text-xs text-gray-400">Total temuan positif per hardware</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={componentStats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Total Kasus">
                {componentStats.map((entry, index) => (
                  <Cell key={index} fill={entry.count > 0 ? '#3b82f6' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Diagnoses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Riwayat Diagnosis Terbaru</h2>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Top 5 Sesi Terakhir</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 divide-y divide-gray-50">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-gray-400 gap-2">
                <AlertTriangle className="w-8 h-8 opacity-20" />
                <p className="text-sm italic">Belum ada riwayat masuk.</p>
              </div>
            ) : (
              history.slice(0, 5).map((h) => (
                <div key={h.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-blue-50/30 transition-colors group">
                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-blue-200">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{h.mainDiagnosis}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 font-medium">{h.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-[10px] text-blue-600 font-bold">{h.symptoms.length} Gejala</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border flex flex-col items-center min-w-[60px] ${confidenceColor(h.confidence)} border-current/20`}>
                    <span className="text-[10px] font-bold uppercase opacity-70 leading-none mb-0.5">CF</span>
                    <span className="text-sm font-black leading-none">{h.confidence}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
