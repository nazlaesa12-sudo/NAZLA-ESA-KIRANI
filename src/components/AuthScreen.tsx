import React, { useState } from 'react';
import { Ship, Anchor, Shield, ArrowRight, Lock, Mail, Key, Waves, CheckCircle2, Database } from 'lucide-react';
import { User } from '../types';
import { DEFAULT_USERS } from '../services/storageService';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@kirani.maritime.id');
  const [password, setPassword] = useState('kirani2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Verify login credentials
      const foundUser = DEFAULT_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (foundUser) {
        onLogin(foundUser);
      } else if (email && password) {
        // Allow custom email login as Admin/Operator
        const customUser: User = {
          id: `user-${Date.now()}`,
          email: email.trim(),
          name: email.split('@')[0].toUpperCase(),
          role: 'admin',
          jabatan: 'Operator Logistik Maritim',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        onLogin(customUser);
      } else {
        setError('Silakan masukkan email dan password yang valid.');
      }
    }, 450);
  };

  const handleQuickLogin = (user: User, defaultPass: string) => {
    setEmail(user.email);
    setPassword(defaultPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-500 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Maritime Waves & Glowing Background Elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-300 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-rose-300 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-fuchsia-400 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl border border-pink-200">
        
        {/* Left Side: Brand & Fleet Hero (Bright Pink Maritime Theme) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-pink-600 to-rose-700 text-white p-8 lg:p-10 flex flex-col justify-between relative">
          <div className="relative z-10">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide uppercase mb-6 text-pink-50">
              <Ship className="w-3.5 h-3.5 text-pink-200 animate-pulse" />
              Armada Angkutan Laut Nasional
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-pink-600 flex items-center justify-center shadow-lg shadow-pink-900/30">
                <Anchor className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  MV KIRANI
                </h1>
                <p className="text-xs text-pink-200 font-medium tracking-wider uppercase">
                  IMO 9842103 • Call Sign YDKI
                </p>
              </div>
            </div>

            <p className="text-pink-100 text-sm mt-4 leading-relaxed">
              Sistem Manajemen Terpadu Angkutan Laut & Logistik Maritim. Menghubungkan pelabuhan strategis Nusantara dengan keandalan operasional, manifest muatan digital, dan monitoring real-time.
            </p>

            {/* Spec Card */}
            <div className="mt-8 bg-pink-800/40 rounded-2xl p-4 border border-pink-400/30 backdrop-blur-md space-y-2 text-xs">
              <div className="flex justify-between items-center text-pink-200">
                <span>Tipe Kapal</span>
                <span className="font-semibold text-white">General Cargo & Container</span>
              </div>
              <div className="flex justify-between items-center text-pink-200">
                <span>Kapasitas Muatan</span>
                <span className="font-semibold text-white">14,500 DWT / 850 TEU</span>
              </div>
              <div className="flex justify-between items-center text-pink-200">
                <span>Database Sync</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                  <Database className="w-3 h-3" /> Neon • Supabase • Firebase
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-pink-500/40 flex items-center justify-between text-xs text-pink-200">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-300" /> ISO 9001 & ISPS Compliant
            </span>
            <span>© 2026 PT Pelayaran Kirani</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>Masuk ke Portal Operasional</span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  Admin Login
                </span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Silakan masukkan email dan password untuk mengakses sistem kapal MV KIRANI.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2 animate-shake">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email / Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kirani.maritime.id"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-pink-600 font-medium cursor-pointer hover:underline">
                    Lupa sandi?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memverifikasi Kredensial...
                    </span>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard MV KIRANI</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Access Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Akun Akses Cepat (Demo):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin(DEFAULT_USERS[0], 'kirani2026')}
                  className="p-2.5 rounded-xl border border-pink-200 bg-pink-50/60 hover:bg-pink-100 text-left transition-all text-xs group"
                >
                  <div className="font-bold text-pink-900 group-hover:text-pink-700 flex items-center justify-between">
                    <span>Admin Utama</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 opacity-80" />
                  </div>
                  <div className="text-[11px] text-pink-700 truncate">admin@kirani.maritime.id</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(DEFAULT_USERS[1], 'nakhoda123')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all text-xs group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-pink-700 flex items-center justify-between">
                    <span>Nakhoda Kapal</span>
                    <Anchor className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600" />
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">nakhoda@kirani.maritime.id</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(DEFAULT_USERS[2], 'logistik123')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all text-xs group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-pink-700 flex items-center justify-between">
                    <span>Logistik</span>
                    <Shield className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600" />
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">logistik@kirani.maritime.id</div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
