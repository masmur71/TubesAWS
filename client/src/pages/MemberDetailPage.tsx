import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Member } from '../types';
import ParticleBackground from '../components/ui/ParticleBackground';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchMember(parseInt(id));
  }, [id]);

  const fetchMember = async (memberId: number) => {
    try {
      const data = await api.getMember(memberId);
      if (data.success && data.member) {
        setMember(data.member);
      } else {
        setError('Anggota tidak ditemukan.');
      }
    } catch {
      setError('Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Memuat profil..." />;

  if (error || !member) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <i className="fa-solid fa-user-slash text-5xl text-surface-700 mb-4" />
          <p className="text-surface-400 text-lg mb-6">{error || 'Data tidak ditemukan.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface-800 hover:bg-surface-700 text-white rounded-xl transition-all duration-300 font-display tracking-wider"
          >
            <i className="fa-solid fa-arrow-left" />
            KEMBALI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-white relative">
      <ParticleBackground />

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: '128px',
      }} />

      {/* Back button */}
      <Link
        to="/dashboard"
        className="fixed top-6 left-6 sm:top-10 sm:left-10 z-20 inline-flex items-center gap-3 font-display text-xl sm:text-2xl tracking-[0.2em] text-white hover:text-brand-400 transition-all duration-300 group"
      >
        <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform" />
        KEMBALI
      </Link>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-4xl mx-auto px-6 py-24 sm:py-32">
          {/* Header */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-wider text-white mb-6 uppercase">
              {member.nama}
            </h1>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-surface-900 border-2 border-surface-700 font-mono text-sm tracking-[0.2em] text-white uppercase font-bold">
              <i className="fa-solid fa-user-tag text-brand-400" />
              {member.role_kelompok || 'Anggota'}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {[
              { icon: 'fa-id-card', label: 'NIM', value: member.nim },
              { icon: 'fa-graduation-cap', label: 'Program Studi', value: member.prodi },
              { icon: 'fa-chalkboard-user', label: 'Kelas', value: member.kelas },
              { icon: 'fa-envelope', label: 'Email', value: member.email },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <span className="block text-[11px] text-surface-500 uppercase tracking-[0.2em] font-bold">
                  <i className={`fa-solid ${item.icon} mr-1.5`} />
                  {item.label}
                </span>
                <span className={`block font-mono text-lg text-white font-medium ${item.label === 'Email' ? 'text-sm break-all' : ''}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span className="block text-sm text-surface-400 uppercase tracking-[0.3em] font-bold mb-4">
                Tentang
              </span>
              <p className="text-lg sm:text-xl leading-[1.8] text-surface-200 font-medium">
                "{member.bio}"
              </p>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-surface-900 border-2 border-surface-700 flex items-center justify-center text-2xl text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#333]"
                title="GitHub"
              >
                <i className="fa-brands fa-github" />
              </a>
            )}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-surface-900 border-2 border-surface-700 flex items-center justify-center text-2xl text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#333]"
                title="LinkedIn"
              >
                <i className="fa-brands fa-linkedin" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
