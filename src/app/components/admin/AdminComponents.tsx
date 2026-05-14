import { useState } from 'react';
import { Plus, Pencil, Trash2, Monitor, Zap, MemoryStick, HardDrive, CircuitBoard, Cpu, Thermometer, Check, AlertTriangle } from 'lucide-react';
import { Component, getComponents, saveComponents } from '../../data/adminStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';

const iconOptions = ['Monitor', 'Zap', 'MemoryStick', 'HardDrive', 'CircuitBoard', 'Cpu', 'Thermometer'];

const iconMap: Record<string, React.ElementType> = {
  Monitor, Zap, MemoryStick, HardDrive, CircuitBoard, Cpu, Thermometer
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  'VGA Card':     { bg: 'bg-purple-50', icon: 'text-purple-600 bg-purple-100' },
  'Power Supply': { bg: 'bg-yellow-50', icon: 'text-yellow-600 bg-yellow-100' },
  'RAM':          { bg: 'bg-green-50',  icon: 'text-green-600 bg-green-100' },
  'Harddisk':     { bg: 'bg-blue-50',   icon: 'text-blue-600 bg-blue-100' },
  'Motherboard':  { bg: 'bg-red-50',    icon: 'text-red-600 bg-red-100' },
  'Processor':    { bg: 'bg-orange-50', icon: 'text-orange-600 bg-orange-100' },
  'Monitor':      { bg: 'bg-cyan-50',   icon: 'text-cyan-600 bg-cyan-100' },
  'Overheat':     { bg: 'bg-rose-50',   icon: 'text-rose-600 bg-rose-100' },
};

const defaultForm = { name: '', description: '', icon: 'Cpu' };

export function AdminComponents() {
  const [components, setComponents] = useState<Component[]>(getComponents());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Component | null>(null);
  const [editing, setEditing] = useState<Component | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (c: Component) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, icon: c.icon });
    setFormError('');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.description.trim()) {
      setFormError('Nama dan deskripsi wajib diisi.');
      return;
    }
    const nameExists = components.some(c => c.name.toLowerCase() === form.name.trim().toLowerCase() && c.id !== editing?.id);
    if (nameExists) {
      setFormError('Nama komponen sudah ada.');
      return;
    }
    let updated: Component[];
    if (editing) {
      updated = components.map(c => c.id === editing.id ? { ...c, ...form, name: form.name.trim() } : c);
      showSuccess('Komponen berhasil diperbarui!');
    } else {
      const newC: Component = { id: String(Date.now()), ...form, name: form.name.trim() };
      updated = [...components, newC];
      showSuccess('Komponen berhasil ditambahkan!');
    }
    setComponents(updated);
    saveComponents(updated);
    setDialogOpen(false);
  };

  const handleDelete = (c: Component) => {
    const updated = components.filter(x => x.id !== c.id);
    setComponents(updated);
    saveComponents(updated);
    setDeleteDialog(null);
    showSuccess('Komponen berhasil dihapus!');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Komponen</h1>
          <p className="text-gray-500 text-sm mt-1">{components.length} komponen PC terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Komponen
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Components Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {components.map(c => {
          const IconComp = iconMap[c.icon] || Cpu;
          const colors = colorMap[c.name] || { bg: 'bg-gray-50', icon: 'text-gray-600 bg-gray-100' };
          return (
            <div key={c.id} className={`${colors.bg} border border-gray-100 rounded-2xl p-5 group relative`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 ${colors.icon} rounded-xl flex items-center justify-center`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 bg-white hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all shadow-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteDialog(c)}
                    className="p-1.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{c.description}</p>
            </div>
          );
        })}
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">Daftar Komponen (Tabel)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Komponen</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {components.map(c => {
                const IconComp = iconMap[c.icon] || Cpu;
                const colors = colorMap[c.name] || { icon: 'text-gray-600 bg-gray-100' };
                return (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${colors.icon} rounded-lg flex items-center justify-center`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 max-w-xs truncate">{c.description}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{c.icon}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteDialog(c)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Komponen' : 'Tambah Komponen Baru'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Ubah data komponen PC.' : 'Isi form untuk menambahkan komponen baru.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Komponen</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Contoh: GPU Card"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsikan fungsi komponen..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map(iconName => {
                  const Ic = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon: iconName }))}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 transition-all text-xs ${
                        form.icon === iconName ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-500'
                      }`}
                    >
                      <Ic className="w-5 h-5" />
                      <span className="truncate w-full text-center">{iconName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Batal
            </button>
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
            <DialogTitle>Hapus Komponen</DialogTitle>
            <DialogDescription>
              Hapus komponen <strong>{deleteDialog?.name}</strong>? Ini juga akan mempengaruhi relasi knowledge base.
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
