import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Check, AlertTriangle } from 'lucide-react';
import { Symptom, getSymptoms, saveSymptom, deleteSymptom } from '../../data/adminStore';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '../ui/dialog';

const categories = ['Tampilan', 'Daya', 'Suara & Boot', 'Sistem', 'Performa', 'Penyimpanan', 'Pendingin'];

const categoryColors: Record<string, string> = {
  'Tampilan':     'bg-purple-100 text-purple-700',
  'Daya':         'bg-yellow-100 text-yellow-700',
  'Suara & Boot': 'bg-blue-100 text-blue-700',
  'Sistem':       'bg-red-100 text-red-700',
  'Performa':     'bg-orange-100 text-orange-700',
  'Penyimpanan':  'bg-green-100 text-green-700',
  'Pendingin':    'bg-cyan-100 text-cyan-700',
};

const empty: Omit<Symptom, 'id'> = { code: '', description: '', category: 'Tampilan' };

export function AdminSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Semua');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Symptom | null>(null);
  const [editing, setEditing] = useState<Symptom | null>(null);
  const [form, setForm] = useState<Omit<Symptom, 'id'>>(empty);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadSymptoms = async () => {
    setLoading(true);
    try {
      const data = await getSymptoms();
      setSymptoms(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSymptoms();
  }, []);

  const filtered = symptoms.filter(s => {
    const matchCat = filterCat === 'Semua' || s.category === filterCat;
    const matchSearch = s.description.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (s: Symptom) => {
    setEditing(s);
    setForm({ code: s.code, description: s.description, category: s.category });
    setFormError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.description.trim()) {
      setFormError('Kode dan deskripsi wajib diisi.');
      return;
    }
    try {
      await saveSymptom({ id: editing?.id || '', ...form, code: form.code.trim().toUpperCase() });
      showSuccess(editing ? 'Gejala berhasil diperbarui!' : 'Gejala berhasil ditambahkan!');
      setDialogOpen(false);
      loadSymptoms();
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan gejala.');
    }
  };

  const handleDelete = async (s: Symptom) => {
    try {
      await deleteSymptom(s.id);
      setDeleteDialog(null);
      showSuccess('Gejala berhasil dihapus!');
      loadSymptoms();
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  if (loading && symptoms.length === 0) return <div className="p-8 text-center text-gray-500">Memuat gejala...</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Gejala</h1>
          <p className="text-gray-500 text-sm mt-1">{symptoms.length} gejala terdaftar dalam sistem</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Gejala
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari gejala atau kode..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi Gejala</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Tidak ada gejala ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center justify-center bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg min-w-[3rem]">
                        {s.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-800">{s.description}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[s.category] || 'bg-gray-100 text-gray-600'}`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog(s)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
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
          Menampilkan {filtered.length} dari {symptoms.length} gejala
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Gejala' : 'Tambah Gejala Baru'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Ubah data gejala yang sudah ada.' : 'Isi form untuk menambahkan gejala baru ke knowledge base.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Gejala</label>
              <input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                placeholder="Contoh: E29"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Gejala</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsikan gejala kerusakan..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editing ? 'Simpan Perubahan' : 'Tambahkan'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Gejala</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus gejala <strong>{deleteDialog?.code}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialog(null)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
