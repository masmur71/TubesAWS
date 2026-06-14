import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        {/* Big 404 */}
        <h1 className="font-display text-[clamp(6rem,20vw,14rem)] leading-none tracking-wider text-surface-800 mb-2">
          404
        </h1>

        <p className="font-display text-2xl sm:text-3xl tracking-wider text-surface-400 mb-4">
          HALAMAN TIDAK DITEMUKAN
        </p>

        <p className="text-surface-600 text-sm max-w-md mx-auto mb-10">
          Halaman yang Anda cari tidak ditemukan. Mungkin sudah dipindahkan atau alamat yang Anda masukkan salah.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-white hover:bg-surface-200 text-surface-950 font-display text-lg tracking-wider rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
        >
          <i className="fa-solid fa-house" />
          KEMBALI KE DASHBOARD
        </Link>
      </div>
    </div>
  );
}
