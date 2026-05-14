import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Check, AlertTriangle, Database, Info } from 'lucide-react';
import { KBRelation, getKBRelations, saveKBRelations, getSymptoms, getComponents } from '../../data/adminStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';

const cfPresets = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

function cfBadge(cf: number) {
  const pct = Math.round(cf * 100);
  if (pct >= 80) return 'bg-green-100 text-green-700';
  if (pct >= 60) return 'bg-blue-100 text-blue-700';
  if (pct >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function cfBarColor(cf: number) {
  if (cf >= 0.8) return 'bg-green-500';
  if (cf >= 0.6) return 'bg-blue-500';
  if (cf >= 0.4) return 'bg-yellow-500';
  return 'bg-red-400';
}

export function AdminKnowledgeBase() {
  const [relations, setRelations] = useState<KBRelation[]>(getKBRelations());
  const symptoms = getSymptoms();
  const components = getComponents();

  const [search, setSearch] = useState('');
  const [filterComp, setFilterComp] = useState('Semua');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<KBRelation | null>(null);
  const [editing, setEditing] = useState<KBRelation | null>(null);
  const [form, setForm] = useState({ symptomCode: '', componentName: '', cfValue: 0.5 });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = relations.filter(r => {
    const s = symptoms.find(x => x.code === r.symptomCode);
    const matchComp = filterComp === 'Semua' || r.componentName === filterComp;
    const matchSearch = r.symptomCode.toLowerCase().includes(search.toLowerCase())
      || r.componentName.toLowerCase().includes(search.toLowerCase())
      || (s?.description.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchComp && matchSearch;
  });

  const grouped = components.reduce<Record<string, KBRelation[]>>((acc, c) => {
    acc[c.name] = relations.filter(r => r.componentName === c.name);
    return acc;
  }, {});

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ symptomCode: symptoms[0]?.code || '', componentName: components[0]?.name || '', cfValue: 0.5 });
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (r: KBRelation) => {
    setEditing(r);
    setForm({ symptomCode: r.symptomCode, componentName: r.componentName, cfValue: r.cfValue });
    setFormError('');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.symptomCode || !form.componentName) {
      setFormError('Gejala dan komponen wajib dipilih.');
      return;
    }
    const duplicate = relations.some(r =>
      r.symptomCode === form.symptomCode &&
      r.componentName === form.componentName &&
      r !== editing
    );
    if (duplicate) {
      setFormError('Relasi ini sudah ada di knowledge base.');
      return;
    }
    let updated: KBRelation[];
    if (editing) {
      updated = relations.map(r =>
        r.symptomCode === editing.symptomCode && r.componentName === editing.componentName
          ? { ...form }
          : r
      );
      showSuccess('Relasi berhasil diperbarui!');
    } else {
      updated = [...relations, { ...form }];
      showSuccess('Relasi berhasil ditambahkan!');
    }
    setRelations(updated);
    saveKBRelations(updated);
    setDialogOpen(false);
  };

  const handleDelete = (r: KBRelation) => {
    const updated = relations.filter(x => !(x.symptomCode === r.symptomCode && x.componentName === r.componentName));
    setRelations(updated);
    saveKBRelations(updated);
    setDeleteDialog(null);
    showSuccess('Relasi berhasil dihapus!');
  };

  const getSymptomDesc = (code: string) => symptoms.find(s => s.code === code)?.description || code;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base (CF)</h1>
          <p className="text-gray-500 text-sm mt-1">{relations.length} aturan Certainty Factor terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Relasi
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Knowledge base menyimpan nilai CF (Certainty Factor) untuk setiap relasi gejala-komponen. Nilai CF berkisar antara <strong>0.1</strong> (lemah) hingga <strong>1.0</strong> (pasti).
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari gejala atau komponen..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
        <select
          value={filterComp}
          onChange={e => setFilterComp(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Semua">Semua Komponen</option>
          {components.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Summary Cards per Component */}
      {filterComp === 'Semua' && search === '' && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {components.map(c => {
            const rels = grouped[c.name] || [];
            const avgCF = rels.length ? (rels.reduce((a, b) => a + b.cfValue, 0) / rels.length) : 0;
            return (
              <button
                key={c.id}
                onClick={() => setFilterComp(c.name)}
                className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{c.name}</span>
                  <span className="text-xs text-gray-400">{rels.length} aturan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={`${cfBarColor(avgCF)} rounded-full h-1.5`} style={{ width: `${avgCF * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">CF avg: {(avgCF * 100).toFixed(0)}%</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode Gejala</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi Gejala</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Komponen</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nilai CF</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Tidak ada relasi ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center justify-center bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg min-w-[3rem]">
                        {r.symptomCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 max-w-xs">
                      <p className="truncate">{getSymptomDesc(r.symptomCode)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-900">{r.componentName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-100 rounded-full h-2">
                          <div className={`${cfBarColor(r.cfValue)} rounded-full h-2 transition-all`} style={{ width: `${r.cfValue * 100}%` }} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfBadge(r.cfValue)}`}>
                          {r.cfValue.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(r)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteDialog(r)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Menampilkan {filtered.length} dari {relations.length} relasi
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Relasi CF' : 'Tambah Relasi CF Baru'}</DialogTitle>
            <DialogDescription>
              Tentukan hubungan antara gejala dan komponen beserta nilai Certainty Factor-nya.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gejala</label>
              <select
                value={form.symptomCode}
                onChange={e => setForm(f => ({ ...f, symptomCode: e.target.value }))}
                disabled={!!editing}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                {symptoms.map(s => (
                  <option key={s.id} value={s.code}>{s.code} — {s.description}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Komponen</label>
              <select
                value={form.componentName}
                onChange={e => setForm(f => ({ ...f, componentName: e.target.value }))}
                disabled={!!editing}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                {components.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nilai CF: <span className="text-blue-600 font-bold">{form.cfValue.toFixed(1)}</span>
                <span className="text-gray-400 text-xs ml-2">({Math.round(form.cfValue * 100)}%)</span>
              </label>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.1}
                value={form.cfValue}
                onChange={e => setForm(f => ({ ...f, cfValue: parseFloat(e.target.value) }))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between mt-2 flex-wrap gap-1">
                {cfPresets.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, cfValue: v }))}
                    className={`text-xs px-2 py-1 rounded-md border transition-all ${
                      form.cfValue === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {v.toFixed(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              {editing ? 'Simpan' : 'Tambahkan'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Relasi</DialogTitle>
            <DialogDescription>
              Hapus relasi <strong>{deleteDialog?.symptomCode}</strong> → <strong>{deleteDialog?.componentName}</strong>? Ini akan mempengaruhi akurasi diagnosis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setDeleteDialog(null)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
            <button onClick={() => deleteDialog && handleDelete(deleteDialog)} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Hapus</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
