import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ui/ParticleBackground';
import InstanceBadge from '../components/ui/InstanceBadge';
import { useServerInfo } from '../hooks/useServerInfo';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { serverInfo } = useServerInfo();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Server badge (top right) */}
      <div className="fixed top-4 right-4 z-10">
        <InstanceBadge serverId={serverInfo?.serverId || '1'} size="sm" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
          {/* Brand */}
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-white mb-2">
              GOATSTENSI
            </h1>
            <p className="font-mono text-xs tracking-[0.3em] text-surface-400 uppercase">
              Tugas Besar BBK3CAB3
            </p>
            <p className="text-surface-500 text-sm mt-1">Komputasi Awan 2026</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-surface-400 uppercase tracking-widest mb-2">
                <i className="fa-solid fa-user mr-1.5" />
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                autoComplete="username"
                autoFocus
                className="w-full px-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-600 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/5 transition-all duration-300 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-surface-400 uppercase tracking-widest mb-2">
                <i className="fa-solid fa-lock mr-1.5" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 pr-12 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-600 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/5 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors p-1"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white hover:bg-surface-200 disabled:bg-surface-700 text-surface-950 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:text-surface-400 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket group-hover:translate-x-0.5 transition-transform" />
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-surface-600 text-xs">
              Kelompok Goatstensi &bull; Telkom University &bull; 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
