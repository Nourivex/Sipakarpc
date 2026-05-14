import { useState } from 'react';
import {
  LayoutDashboard, AlertCircle, Cpu, Database, History,
  LogOut, Menu, X, ChevronRight, Bell, User, ExternalLink
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminSymptoms } from './AdminSymptoms';
import { AdminComponents } from './AdminComponents';
import { AdminKnowledgeBase } from './AdminKnowledgeBase';
import { AdminHistory } from './AdminHistory';

type AdminPage = 'dashboard' | 'symptoms' | 'components' | 'knowledgebase' | 'history';

interface AdminLayoutProps {
  onLogout: () => void;
  onGoToMain: () => void;
}

const navItems: { id: AdminPage; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'symptoms', label: 'Manajemen Gejala', icon: AlertCircle, badge: '28' },
  { id: 'components', label: 'Manajemen Komponen', icon: Cpu, badge: '8' },
  { id: 'knowledgebase', label: 'Knowledge Base (CF)', icon: Database, badge: '37' },
  { id: 'history', label: 'Riwayat Diagnosis', icon: History, badge: '10' },
];

export function AdminLayout({ onLogout, onGoToMain }: AdminLayoutProps) {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentNav = navItems.find(n => n.id === activePage)!;

  const handleNav = (id: AdminPage) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">SiPakarPC</p>
            <p className="text-slate-400 text-xs">Panel Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Menu Utama</p>
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={onGoToMain}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span>Lihat Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Keluar</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Administrator</p>
              <p className="text-slate-500 text-xs">admin@sipakarpc.id</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Admin</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="font-medium text-gray-900">{currentNav.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">Administrator</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {activePage === 'dashboard'    && <AdminDashboard />}
          {activePage === 'symptoms'     && <AdminSymptoms />}
          {activePage === 'components'   && <AdminComponents />}
          {activePage === 'knowledgebase'&& <AdminKnowledgeBase />}
          {activePage === 'history'      && <AdminHistory />}
        </main>
      </div>
    </div>
  );
}
