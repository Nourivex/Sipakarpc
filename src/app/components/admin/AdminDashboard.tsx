import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import {
  Activity, AlertCircle, Database, TrendingUp, Users,
  CheckCircle2, AlertTriangle, ShieldCheck, Clock, Cpu,
  ArrowUpRight, ArrowDownRight, Minus, Zap, HardDrive,
} from 'lucide-react';
import {
  getHistory, getSymptoms, getComponents, getKBRelations,
  DiagnosisHistory, Symptom, Component, KBRelation,
} from '../../data/adminStore';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COMPONENT_PALETTE: Record<string, string> = {
  Motherboard:     '#EF4444',
  Processor:       '#F97316',
  RAM:             '#22C55E',
  'VGA Card':      '#A855F7',
  'Power Supplay': '#EAB308',
  Harddisk:        '#3B82F6',
  Monitor:         '#06B6D4',
  Overheat:        '#F43F5E',
};

function cfColor(cf: number) {
  if (cf >= 75) return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', bar: '#22C55E' };
  if (cf >= 50) return { text: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200',  bar: '#3B82F6' };
  if (cf >= 30) return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', bar: '#EAB308' };
  return         { text: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   bar: '#EF4444' };
}

function cfLabel(cf: number) {
  if (cf >= 75) return 'Sangat Tinggi';
  if (cf >= 50) return 'Tinggi';
  if (cf >= 30) return 'Sedang';
  return 'Rendah';
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  colorClass: string;
  iconBg: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
}

function StatCard({ label, value, sub, icon: Icon, colorClass, iconBg, trend, trendLabel }: StatCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trendLabel}
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

// Donut chart center label plugin
function DonutLabel({ cx, cy, label, sub }: { cx: number; cy: number; label: string; sub: string }) {
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 20, fontWeight: 900, fill: '#111827', fontFamily: 'Calibri, sans-serif' }}>
        {label}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fill: '#6B7280', fontFamily: 'Calibri, sans-serif' }}>
        {sub}
      </text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [history, setHistory]       = useState<DiagnosisHistory[]>([]);
  const [symptoms, setSymptoms]     = useState<Symptom[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [kbRelations, setKbRelations] = useState<KBRelation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [now, setNow]               = useState(new Date());

  // Tick clock every minute
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [h, s, c, k] = await Promise.all([
          getHistory(), getSymptoms(), getComponents(), getKBRelations(),
        ]);
        setHistory(h);
        setSymptoms(s);
        setComponents(c);
        setKbRelations(k);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalDiagnosis = history.length;

  const avgConfidence = useMemo(() =>
    totalDiagnosis > 0
      ? Math.round(history.reduce((a, b) => a + b.confidence, 0) / totalDiagnosis)
      : 0,
    [history, totalDiagnosis]
  );

  const highConfCount = useMemo(() => history.filter((h) => h.confidence >= 75).length, [history]);

  // Component frequency for bar + donut
  const componentStats = useMemo(() =>
    components
      .map((comp) => ({
        name: comp.name,
        count: history.filter((h) => h.mainDiagnosis === comp.name).length,
        fill: COMPONENT_PALETTE[comp.name] ?? '#94A3B8',
      }))
      .sort((a, b) => b.count - a.count),
    [components, history]
  );

  const pieData = componentStats.filter((c) => c.count > 0);
  const totalPie = pieData.reduce((a, b) => a + b.count, 0);

  // 7-day trend grouped by date
  const trendData = useMemo(() => {
    const map: Record<string, { sesi: number; avgCF: number; total: number }> = {};
    history.forEach((h) => {
      const d = h.date.split(',')[0].trim();
      if (!map[d]) map[d] = { sesi: 0, avgCF: 0, total: 0 };
      map[d].sesi++;
      map[d].total += h.confidence;
      map[d].avgCF = Math.round(map[d].total / map[d].sesi);
    });
    return Object.entries(map)
      .map(([day, v]) => ({ day, ...v }))
      .slice(-7);
  }, [history]);

  // CF distribution buckets
  const cfBuckets = useMemo(() => [
    { label: '≥75% Sangat Tinggi', count: history.filter((h) => h.confidence >= 75).length, fill: '#22C55E' },
    { label: '50–74% Tinggi',      count: history.filter((h) => h.confidence >= 50 && h.confidence < 75).length, fill: '#3B82F6' },
    { label: '30–49% Sedang',      count: history.filter((h) => h.confidence >= 30 && h.confidence < 50).length, fill: '#EAB308' },
    { label: '<30% Rendah',        count: history.filter((h) => h.confidence < 30).length, fill: '#EF4444' },
  ], [history]);

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-800">Menganalisis data sistem pakar...</p>
          <p className="text-xs text-gray-400 mt-1">Memuat history, gejala, dan basis pengetahuan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analitik</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Ringkasan performa sistem pakar diagnosa kerusakan PC
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-4 py-2.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">
            {now.toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Diagnosis"
          value={String(totalDiagnosis)}
          sub="Sesi tersimpan di database"
          icon={Activity}
          colorClass="text-blue-600"
          iconBg="bg-blue-50"
          trend="up"
          trendLabel={totalDiagnosis > 0 ? `${totalDiagnosis} sesi` : 'Belum ada'}
        />
        <StatCard
          label="Rata-rata CF"
          value={`${avgConfidence}%`}
          sub={`Kategori: ${cfLabel(avgConfidence)}`}
          icon={ShieldCheck}
          colorClass="text-green-600"
          iconBg="bg-green-50"
          trend={avgConfidence >= 50 ? 'up' : 'down'}
          trendLabel={`${avgConfidence}%`}
        />
        <StatCard
          label="CF Sangat Tinggi"
          value={String(highConfCount)}
          sub={`${totalDiagnosis > 0 ? Math.round((highConfCount / totalDiagnosis) * 100) : 0}% dari total sesi`}
          icon={TrendingUp}
          colorClass="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Basis Pengetahuan"
          value={String(kbRelations.length)}
          sub={`${symptoms.length} gejala · ${components.length} komponen`}
          icon={Database}
          colorClass="text-orange-600"
          iconBg="bg-orange-50"
          trend="flat"
          trendLabel="Stabil"
        />
      </div>

      {/* ── System Info Banner ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Cpu,       label: 'Komponen', value: `${components.length} hardware` },
          { icon: AlertCircle, label: 'Gejala',   value: `${symptoms.length} kode (E01–E28)` },
          { icon: Zap,       label: 'Rules KB',  value: `${kbRelations.length} relasi MB/MD` },
          { icon: HardDrive, label: 'Metode',    value: 'Certainty Factor' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
              <p className="text-xs font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1: Area Trend + Donut ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Area Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Tren Penggunaan Sistem</h2>
              <p className="text-xs text-gray-400 mt-0.5">Jumlah sesi dan rata-rata CF per hari (7 hari terakhir)</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" /> Sesi</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block rounded" /> CF (%)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData.length > 0 ? trendData : [{ day: 'Belum ada data', sesi: 0, avgCF: 0 }]}
              margin={{ left: -10, right: 0 }}>
              <defs>
                <linearGradient id="gradSesi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px' }}
                labelStyle={{ fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="sesi" stroke="#3B82F6" strokeWidth={2.5}
                fill="url(#gradSesi)" dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }} name="Sesi Diagnosis" />
              <Area type="monotone" dataKey="avgCF" stroke="#22C55E" strokeWidth={2.5}
                fill="url(#gradCF)" dot={{ fill: '#22C55E', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }} name="Rata-rata CF (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut: Distribusi Kerusakan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="font-bold text-gray-900">Distribusi Kerusakan</h2>
            <p className="text-xs text-gray-400 mt-0.5">Komponen paling sering terdiagnosis</p>
          </div>
          {pieData.length > 0 ? (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData} cx="50%" cy="50%"
                    innerRadius={58} outerRadius={82}
                    dataKey="count" nameKey="name"
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  {/* Center label via custom label — use foreignObject trick via recharts label */}
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '11px' }}
                    formatter={(v: number) => [`${v} sesi (${Math.round((v / totalPie) * 100)}%)`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                {pieData.slice(0, 6).map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: p.fill }} />
                    <span className="text-[10px] text-gray-600 truncate">{p.name}</span>
                    <span className="text-[10px] font-bold text-gray-800 ml-auto">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
              <AlertTriangle className="w-10 h-10 opacity-30" />
              <p className="text-xs italic text-gray-400">Belum ada data diagnosis</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Charts Row 2: Bar + CF Bucket + Recent ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Horizontal Bar: Frekuensi Komponen */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-bold text-gray-900">Frekuensi per Komponen</h2>
            <p className="text-xs text-gray-400 mt-0.5">Total sesi dengan kerusakan utama per hardware</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={componentStats} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category"
                tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }}
                axisLine={false} tickLine={false} width={90} />
              <Tooltip
                cursor={{ fill: '#F9FAFB' }}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '11px' }}
                formatter={(v: number) => [v === 0 ? 'Tidak ada kasus' : `${v} sesi`, 'Frekuensi']}
              />
              <Bar dataKey="count" radius={[0, 5, 5, 0]} name="Total Kasus" maxBarSize={18}>
                {componentStats.map((entry, i) => (
                  <Cell key={i} fill={entry.count > 0 ? (COMPONENT_PALETTE[entry.name] ?? '#3B82F6') : '#E5E7EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CF Distribution Buckets */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-bold text-gray-900">Distribusi Tingkat CF</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sebaran keyakinan dari seluruh sesi diagnosa</p>
          </div>
          <div className="space-y-3">
            {cfBuckets.map((b) => {
              const pct = totalDiagnosis > 0 ? Math.round((b.count / totalDiagnosis) * 100) : 0;
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{b.label}</span>
                    <span className="font-bold text-gray-800">{b.count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: b.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary insight */}
          {totalDiagnosis > 0 && (
            <div className={`mt-5 rounded-xl p-3 border text-xs ${cfColor(avgConfidence).bg} ${cfColor(avgConfidence).border}`}>
              <p className={`font-bold ${cfColor(avgConfidence).text}`}>
                Rata-rata keyakinan sistem: {avgConfidence}% ({cfLabel(avgConfidence)})
              </p>
              <p className="text-gray-500 mt-0.5">
                {highConfCount} dari {totalDiagnosis} sesi mencapai tingkat keyakinan ≥ 75%.
              </p>
            </div>
          )}
        </div>

        {/* Recent Diagnoses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Riwayat Terbaru</h2>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">5 Sesi Terakhir</p>
            </div>
            <Users className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex-1 divide-y divide-gray-50">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-gray-300 gap-3">
                <AlertTriangle className="w-10 h-10 opacity-30" />
                <p className="text-sm italic text-gray-400">Belum ada riwayat diagnosis.</p>
              </div>
            ) : (
              history.slice(0, 5).map((h) => {
                const col = cfColor(h.confidence);
                return (
                  <div key={h.id} className="px-5 py-3 flex items-center gap-3 hover:bg-blue-50/20 transition-colors group">
                    <div className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-blue-200 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{h.mainDiagnosis}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-400">{h.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[10px] text-blue-500 font-bold">{h.symptoms.length} Gejala</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1.5 rounded-lg border ${col.bg} ${col.border} flex flex-col items-center min-w-[52px]`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${col.text} opacity-70 leading-none mb-0.5`}>CF</span>
                      <span className={`text-sm font-black leading-none ${col.text}`}>{h.confidence}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {history.length > 5 && (
            <div className="px-5 py-2.5 border-t border-gray-50 text-center">
              <p className="text-[10px] text-gray-400 font-medium">
                +{history.length - 5} sesi lainnya tersedia di menu Riwayat
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
