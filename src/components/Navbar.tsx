import React, { useState, useEffect } from 'react';
import { 
  Ship, Anchor, Database, Navigation, FileText, Layers, 
  BarChart3, Radio, LogOut, RefreshCw, ChevronDown, Check,
  AlertCircle, Shield, Bell, Compass
} from 'lucide-react';
import { User, DatabaseConfig } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  dbConfig: DatabaseConfig;
  onOpenDbModal: () => void;
  simulating: boolean;
  onToggleSimulation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  dbConfig,
  onOpenDbModal,
  simulating,
  onToggleSimulation
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDbBadge = () => {
    switch (dbConfig.activeProvider) {
      case 'neon':
        return { label: 'Neon DB (Postgres)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
      case 'supabase':
        return { label: 'Supabase Cloud', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
      case 'firebase':
        return { label: 'Firebase Firestore', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
      default:
        return { label: 'Local + Multi-Cloud Sync', color: 'bg-pink-500/30 text-pink-200 border-pink-400/40' };
    }
  };

  const dbBadge = getDbBadge();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-pink-700 via-pink-600 to-rose-600 text-white shadow-xl shadow-pink-900/15 border-b border-pink-500/50">
      
      {/* Top Bar Status Ticker */}
      <div className="bg-pink-900/40 px-4 py-1 text-[11px] flex items-center justify-between border-b border-pink-500/20 text-pink-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex items-center gap-1 font-semibold text-pink-200 uppercase tracking-wider shrink-0">
            <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
            AIS TELEMETRI MV KIRANI:
          </span>
          <span className="truncate text-white font-mono">
            Laut Jawa (Pos: -5.78°S, 113.82°E) • Speed: 14.8 Knots • Heading: 078° • Status: In-Transit ke Makassar • Cuaca: Gelombang 1.2m
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="font-mono bg-pink-950/50 px-2 py-0.5 rounded text-pink-200 border border-pink-700/50">
            {timeStr}
          </span>
          <button
            onClick={onToggleSimulation}
            title="Klik untuk menyalakan/mematikan simulasi GPS bergerak secara real-time"
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              simulating
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-900/40'
                : 'bg-pink-800 text-pink-200 hover:bg-pink-700'
            }`}
          >
            <RefreshCw className={`w-2.5 h-2.5 ${simulating ? 'animate-spin' : ''}`} />
            {simulating ? 'Simulasi Live ON' : 'Mulai Simulasi GPS'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Vessel Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-md shadow-pink-900/30 transform transition-transform hover:scale-105">
              <Anchor className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  MV KIRANI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30 tracking-wider">
                  IMO 9842103
                </span>
              </div>
              <p className="text-[11px] text-pink-200 font-medium tracking-wide">
                Sistem Angkutan Laut & Logistik Maritim
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-pink-800/40 p-1 rounded-2xl border border-pink-500/30 backdrop-blur-md">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-pink-700 shadow-md shadow-pink-900/20'
                  : 'text-pink-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard & Analitik</span>
            </button>

            <button
              id="nav-tab-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-white text-pink-700 shadow-md shadow-pink-900/20'
                  : 'text-pink-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-300" />
              <span>Monitoring Real-Time</span>
            </button>

            <button
              id="nav-tab-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-white text-pink-700 shadow-md shadow-pink-900/20'
                  : 'text-pink-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Transaksi & Manifest B/L</span>
            </button>

            <button
              id="nav-tab-master"
              onClick={() => setActiveTab('master')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'master'
                  ? 'bg-white text-pink-700 shadow-md shadow-pink-900/20'
                  : 'text-pink-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Master Data</span>
            </button>

            <button
              id="nav-tab-reports"
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-white text-pink-700 shadow-md shadow-pink-900/20'
                  : 'text-pink-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Laporan</span>
            </button>
          </nav>

          {/* Right Actions: Database Manager Pill & User Profile */}
          <div className="flex items-center gap-3">
            
            {/* Database Switcher / Connector Chip */}
            <button
              id="btn-open-db-modal"
              onClick={onOpenDbModal}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer hover:bg-white/10 ${dbBadge.color}`}
              title="Kelola Koneksi Database: Neon DB, Supabase, Firebase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">{dbBadge.label}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-pink-800/40 hover:bg-pink-800/70 border border-pink-500/30 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-white/40"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-pink-200 font-medium capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-pink-200" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-800 shadow-2xl border border-pink-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[10px] font-semibold border border-pink-200">
                      <Shield className="w-3 h-3" /> {currentUser.jabatan}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={onOpenDbModal}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-pink-600" />
                      <span>Konfigurasi Database Real</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('master')}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Ship className="w-3.5 h-3.5 text-pink-600" />
                      <span>Data Armada & Awak Kapal</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      id="btn-logout"
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-pink-500/30">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${activeTab === 'dashboard' ? 'bg-white text-pink-700' : 'text-pink-100'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${activeTab === 'tracking' ? 'bg-white text-pink-700' : 'text-pink-100'}`}
          >
            Real-Time AIS
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${activeTab === 'transactions' ? 'bg-white text-pink-700' : 'text-pink-100'}`}
          >
            Transaksi & B/L
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${activeTab === 'master' ? 'bg-white text-pink-700' : 'text-pink-100'}`}
          >
            Master Data
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${activeTab === 'reports' ? 'bg-white text-pink-700' : 'text-pink-100'}`}
          >
            Laporan
          </button>
        </div>

      </div>
    </header>
  );
};
