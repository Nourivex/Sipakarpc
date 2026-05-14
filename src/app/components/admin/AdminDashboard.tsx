import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Cpu, AlertCircle, Database, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { getHistory, getSymptoms, getComponents, getKBRelations, DiagnosisHistory, Symptom, Component, KBRelation } from '../../data/adminStore';

const diagnosisFrequency = [
  { name: 'Harddisk', count: 18, fill: '#3b82f6' },
  { name: 'VGA Card', count: 14, fill: '#8b5cf6' },
  { name: 'RAM', count: 12, fill: '#10b981' },
  { name: 'Overheat', count: 10, fill: '#f59e0b' },
  { name: 'Power Supply', count: 9, fill: '#eab308' },
  { name: 'Monitor', count: 7, fill: '#06b6d4' },
  { name: 'Processor', count: 6, fill: '#f97316' },
  { name: 'Motherboard', count: 4, fill: '#ef4444' },
];

const trendData = [
  { day: '4 Mei', count: 5 },
  { day: '5 Mei', count: 8 },
  { day: '6 Mei', count: 12 },
  { day: '7 Mei', count: 7 },
  { day: '8 Mei', count: 15 },
  { day: '9 Mei', count: 10 },
  { day: '10 Mei', count: 23 },
];

const pieData = diagnosisFrequency.map(d => ({ name: d.name, value: d.count, fill: d.fill }));

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

  const statCards = [
    { label: 'Total Diagnosis', value: String(history.length), change: 'Sesi tersimpan', icon: Activity, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Total Gejala', value: String(symptoms.length), change: 'Gejala aktif', icon: AlertCircle, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
    { label: 'Total Komponen', value: String(components.length), change: '8 komponen aktif', icon: Cpu, color: 'bg-green-500', light: 'bg-green-50 text-green-600' },
    { label: 'Relasi KB', value: String(kbRelations.length), change: 'Aturan CF aktif', icon: Database, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600' },
  ];

  const recentHistory = history.slice(0, 5);

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Gambaran umum sistem pakar diagnosis PC</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.change}</p>
              </div>
              <div className={`w-11 h-11 ${s.light} rounded-xl flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Tren Diagnosis</h2>
              <p className="text-xs text-gray-400">7 hari terakhir</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +53% minggu ini
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Diagnosis" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">Distribusi Kerusakan</h2>
            <p className="text-xs text-gray-400">Berdasarkan frekuensi diagnosis</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Full Width */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-gray-900">Frekuensi Diagnosis per Komponen</h2>
          <p className="text-xs text-gray-400">Total kasus terdeteksi</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={diagnosisFrequency} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
              cursor={{ fill: '#f9fafb' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Kasus">
              {diagnosisFrequency.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Diagnoses */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Riwayat Diagnosis Terbaru</h2>
            <p className="text-xs text-gray-400">{history.length} diagnosis tersimpan</p>
          </div>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="divide-y divide-gray-50">
          {recentHistory.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">Belum ada riwayat diagnosis.</div>
          ) : (
            recentHistory.map((h) => (
              <div key={h.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{h.mainDiagnosis}</p>
                  <p className="text-xs text-gray-400">{h.symptoms.length} gejala &bull; {h.date}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${confidenceColor(h.confidence)}`}>
                  {h.confidence}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
