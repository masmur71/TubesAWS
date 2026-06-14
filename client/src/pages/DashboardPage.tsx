import { useState, useEffect, useRef } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardData, Member } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ParticleBackground from '../components/ui/ParticleBackground';
import MemberCard from '../components/ui/MemberCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MemberDetailModal from '../components/modals/MemberDetailModal';

export default function DashboardPage() {
  const location = useLocation();
  const isMemberDetail = location.pathname.startsWith('/members/');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [data]);

  // Lock body scroll when modal is open to preserve dashboard scroll position
  useEffect(() => {
    if (isMemberDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMemberDetail]);

  const fetchData = async () => {
    try {
      const dashData = await api.getDashboard();
      setData(dashData);
    } catch (err) {
      console.error('Dashboard error:', err);
      setData({
        stats: { totalMembers: 0, totalUsers: 0 },
        members: [],
        serverId: '1',
        serverName: 'WebServer-Instance-1',
        nodeVersion: '',
        environment: 'development',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Memuat Dashboard..." />;

  const members: Member[] = data?.members || [];

  return (
    <>
      <div aria-hidden={isMemberDetail}>
        <div className="min-h-screen bg-surface-950 text-white">
          <ParticleBackground />
          <Navbar
            serverId={data?.serverId}
            serverName={data?.serverName}
            nodeVersion={data?.nodeVersion}
            environment={data?.environment}
          />

          {/* ===== HERO SECTION ===== */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
              backgroundSize: '128px',
            }} />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950 pointer-events-none z-[1]" />

            <div className="relative z-[2] text-center px-4 max-w-5xl mx-auto pt-20">
              {/* Title */}
              <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.9] tracking-wider text-white mb-8 animate-fade-in-up">
                goatstensi
              </h1>

              {/* Hero Image */}
              <div className="relative max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-brand-400/10 to-brand-500/20 rounded-2xl blur-xl animate-glow" />
                <div className="relative rounded-2xl overflow-hidden border border-surface-800 shadow-2xl shadow-black/50">
                  <img
                    src="/uploads/main-photo.JPG"
                    alt="Goatstensi — Kelompok Komputasi Awan"
                    className={`w-full aspect-video object-cover transition-all duration-1000 ${heroImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    onLoad={() => setHeroImageLoaded(true)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const ph = document.getElementById('heroPlaceholder');
                      if (ph) ph.style.display = 'flex';
                    }}
                  />
                  <div
                    id="heroPlaceholder"
                    className="hidden aspect-video items-center justify-center flex-col gap-3 bg-surface-900 text-surface-600"
                  >
                    <i className="fa-solid fa-image text-4xl" />
                    <span className="font-mono text-xs">uploads/main-photo.JPG</span>
                    <small className="text-surface-700 text-xs">Letakkan gambar hero di folder tersebut</small>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-surface-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed italic animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                "Goatstensi, tercipta di Bandung pada tahun 2023. Sekelompok GOAT pecinta alam, spesimen spesial umat manusia, pencari makna, dan peraih mimpi"
              </p>
            </div>


          </section>

          {/* ===== QUOTE STRIP ===== */}
          <section
            ref={(el) => { sectionRefs.current[0] = el; }}
            className="bg-surface-950 py-8 overflow-hidden animate-section"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface-950 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface-950 to-transparent z-10" />
              <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-8 px-4">
                    {['KOMPUTASI AWAN', 'TELKOM UNIVERSITY', 'BBK3CAB3', '2026'].map((text, j) => (
                      <span key={j} className="flex items-center gap-8">
                        <span className="font-display text-2xl sm:text-3xl tracking-[0.5em] text-surface-700">
                          {text}
                        </span>
                        <span className="text-surface-800 text-xl">●</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== MEMBERS SECTION ===== */}
          <section
            id="members"
            ref={(el) => { sectionRefs.current[1] = el; }}
            className="relative py-24 sm:py-32 animate-section bg-surface-950"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-surface-800 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <span className="inline-block font-mono text-xs tracking-[0.4em] text-brand-400 uppercase mb-4">
                  Kelompok BBK3CAB3
                </span>
                <h2 className="font-display text-5xl sm:text-6xl tracking-wider text-white">
                  TIM KAMI
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {data?.members ? (
                  data.members.map((member, idx) => (
                    <MemberCard key={member.id} member={member} index={idx} />
                  ))
                ) : (
                  // Skeleton placeholders
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[3/4] bg-surface-800" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-surface-800 rounded w-3/4" />
                        <div className="h-3 bg-surface-800 rounded w-1/2" />
                        <div className="h-3 bg-surface-800 rounded w-full" />
                        <div className="h-3 bg-surface-800 rounded w-2/3" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ===== VIDEO SECTION ===== */}
          <section
            ref={(el) => { sectionRefs.current[2] = el; }}
            className="relative py-24 sm:py-32 animate-section"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <span className="inline-block font-mono text-xs tracking-[0.4em] text-brand-400 uppercase mb-4">
                  Showcase
                </span>
                <h2 className="font-display text-5xl sm:text-6xl tracking-wider text-white">
                  Portofolio Goatstensi
                </h2>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-surface-800 shadow-2xl shadow-black/50">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/10 to-brand-500/5 rounded-2xl blur-xl" />
                <div className="relative aspect-video bg-surface-900">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/7INsVaR-S-w?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>

          <Footer serverId={data?.serverId} serverName={data?.serverName} />
        </div>
      </div>

      <Routes>
        <Route path="/members/:id" element={
          <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-950 animate-fade-in duration-500">
            <MemberDetailModal />
          </div>
        } />
      </Routes>
    </>
  );
}
