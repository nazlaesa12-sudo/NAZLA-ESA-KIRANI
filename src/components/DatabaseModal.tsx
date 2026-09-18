import React, { useState } from 'react';
import { 
  Database, Server, Flame, CheckCircle2, XCircle, AlertCircle, 
  RefreshCw, ShieldCheck, Zap, X, Globe, Lock, ExternalLink
} from 'lucide-react';
import { DatabaseConfig } from '../types';
import { storageService } from '../services/storageService';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DatabaseConfig;
  onSaveConfig: (config: DatabaseConfig) => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState<'neon' | 'supabase' | 'firebase'>('neon');
  const [formData, setFormData] = useState<DatabaseConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    provider: string;
    success: boolean;
    message: string;
    latencyMs?: number;
    details?: any;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestNeon = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db/test-neon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString: formData.neon.connectionString })
      });
      const data = await res.json();
      setTestResult({
        provider: 'Neon DB (PostgreSQL)',
        success: data.success,
        message: data.message,
        latencyMs: data.latencyMs,
        details: data.details
      });
      if (data.success) {
        const updated = {
          ...formData,
          neon: { ...formData.neon, status: 'connected' as const }
        };
        setFormData(updated);
        onSaveConfig(updated);
      }
    } catch (e: any) {
      setTestResult({
        provider: 'Neon DB (PostgreSQL)',
        success: false,
        message: e.message || 'Koneksi gagal ke server Neon DB.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleTestSupabase = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db/test-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.supabase.url,
          anonKey: formData.supabase.anonKey
        })
      });
      const data = await res.json();
      setTestResult({
        provider: 'Supabase Cloud',
        success: data.success,
        message: data.message,
        latencyMs: data.latencyMs,
        details: data.details
      });
      if (data.success) {
        const updated = {
          ...formData,
          supabase: { ...formData.supabase, status: 'connected' as const }
        };
        setFormData(updated);
        onSaveConfig(updated);
      }
    } catch (e: any) {
      setTestResult({
        provider: 'Supabase Cloud',
        success: false,
        message: e.message || 'Koneksi gagal ke Supabase REST API.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleTestFirebase = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db/test-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: formData.firebase?.projectId
        })
      });
      const data = await res.json();
      setTestResult({
        provider: 'Firebase Firestore',
        success: data.success,
        message: data.message,
        latencyMs: data.latencyMs,
        details: data.details
      });
      if (data.success) {
        const updated = {
          ...formData,
          firebase: { ...formData.firebase!, status: 'connected' as const }
        };
        setFormData(updated);
        onSaveConfig(updated);
      }
    } catch (e: any) {
      setTestResult({
        provider: 'Firebase Firestore',
        success: false,
        message: e.message || 'Koneksi gagal ke Firebase Firestore.'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Pusat Integrasi Real Database
              </h3>
              <p className="text-xs text-slate-500">
                Koneksi langsung ke PostgreSQL (Neon DB), Supabase, dan Firebase Firestore
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Tabs */}
        <div className="mt-6 flex gap-2 p-1.5 bg-pink-50/60 rounded-2xl border border-pink-100">
          <button
            onClick={() => { setActiveTab('neon'); setTestResult(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'neon'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Neon DB (PostgreSQL)</span>
          </button>

          <button
            onClick={() => { setActiveTab('supabase'); setTestResult(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Supabase Cloud</span>
          </button>

          <button
            onClick={() => { setActiveTab('firebase'); setTestResult(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'firebase'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Firebase Firestore</span>
          </button>
        </div>

        {/* Active Database Form Area */}
        <div className="mt-6 space-y-4 text-xs text-slate-700">
          
          {/* 1. Neon DB Tab */}
          {activeTab === 'neon' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-sm">
                  <Server className="w-4 h-4 text-emerald-600" />
                  Neon Serverless PostgreSQL
                </h4>
                <p className="text-slate-600 mt-1">
                  Database relasional utama untuk transaksi muatan laut, manifest B/L, dan kueri SQL performa tinggi MV KIRANI.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  PostgreSQL Connection String (URI)
                </label>
                <input
                  type="text"
                  placeholder="postgresql://user:password@ep-name.region.aws.neon.tech/neondb?sslmode=require"
                  value={formData.neon.connectionString}
                  onChange={e => setFormData({
                    ...formData,
                    neon: { ...formData.neon, connectionString: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Format: postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Status Saat Ini: <strong className="uppercase text-emerald-700">{formData.neon.status}</strong>
                </span>

                <button
                  onClick={handleTestNeon}
                  disabled={testing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Menguji Koneksi...' : 'Uji Koneksi Neon DB'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Supabase Tab */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  Supabase REST & PostgREST API
                </h4>
                <p className="text-slate-600 mt-1">
                  Sinkronisasi cloud instant untuk data pelanggan, tracking status kargo kapal, dan webhook notifikasi real-time.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzprojectref.supabase.co"
                  value={formData.supabase.url}
                  onChange={e => setFormData({
                    ...formData,
                    supabase: { ...formData.supabase, url: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.supabase.anonKey}
                  onChange={e => setFormData({
                    ...formData,
                    supabase: { ...formData.supabase, anonKey: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Status Saat Ini: <strong className="uppercase text-emerald-700">{formData.supabase.status}</strong>
                </span>

                <button
                  onClick={handleTestSupabase}
                  disabled={testing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Menguji Koneksi...' : 'Uji Koneksi Supabase'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Firebase Tab */}
          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-bold text-amber-950 flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Google Firebase Firestore
                </h4>
                <p className="text-slate-600 mt-1">
                  Penyimpanan dokumen NoSQL real-time untuk audit log aktivitas, history pergerakan GPS kapal, dan telemetri AIS.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Firebase Project ID
                </label>
                <input
                  type="text"
                  placeholder="mv-kirani-maritime-2026"
                  value={formData.firebase?.projectId || ''}
                  onChange={e => setFormData({
                    ...formData,
                    firebase: {
                      projectId: e.target.value,
                      apiKey: formData.firebase?.apiKey || '',
                      status: formData.firebase?.status || 'disconnected'
                    }
                  })}
                  className="w-full p-3 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Firebase Web API Key (Opsional)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={formData.firebase?.apiKey || ''}
                  onChange={e => setFormData({
                    ...formData,
                    firebase: {
                      projectId: formData.firebase?.projectId || '',
                      apiKey: e.target.value,
                      status: formData.firebase?.status || 'disconnected'
                    }
                  })}
                  className="w-full p-3 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Status Saat Ini: <strong className="uppercase text-amber-700">{formData.firebase?.status || 'disconnected'}</strong>
                </span>

                <button
                  onClick={handleTestFirebase}
                  disabled={testing}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Menguji Koneksi...' : 'Uji Koneksi Firebase'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Test Result Alert Banner */}
          {testResult && (
            <div className={`mt-4 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-extrabold text-xs">
                  {testResult.provider}: {testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}
                </div>
                <div className="text-xs">{testResult.message}</div>
                {testResult.latencyMs && (
                  <div className="text-[10px] text-slate-500">
                    Latency: {testResult.latencyMs}ms • Server Response OK
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
