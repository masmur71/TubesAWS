import { Link } from 'react-router-dom';
import type { Member } from '../../types';

interface MemberCardProps {
  member: Member;
  index: number;
}

export default function MemberCard({ member, index }: MemberCardProps) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="group block h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-full flex flex-col bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-surface-600 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 animate-fade-in-up">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={`/uploads/${member.foto || 'default-avatar.png'}`}
            alt={member.nama}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/default-avatar.png';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500 flex items-center justify-center">
            <span className="text-white font-display text-lg tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
              <i className="fa-solid fa-arrow-right" />
              LIHAT DETAIL
            </span>
          </div>

          {/* Role tag */}
          {member.role_kelompok && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-surface-950/80 backdrop-blur-sm border border-surface-700 rounded-full text-[10px] font-mono text-white tracking-wider uppercase font-bold">
              {member.role_kelompok}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-xl tracking-wider text-white group-hover:text-surface-300 transition-colors duration-300 mb-3">
            {member.nama}
          </h3>

          <div className="space-y-1.5 mb-3">
            <p className="text-surface-400 text-xs flex items-center gap-2">
              <i className="fa-solid fa-id-card w-3.5 text-center text-surface-600" />
              {member.nim}
            </p>
            <p className="text-surface-400 text-xs flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap w-3.5 text-center text-surface-600" />
              {member.prodi}
            </p>
            <p className="text-surface-400 text-xs flex items-center gap-2">
              <i className="fa-solid fa-chalkboard-user w-3.5 text-center text-surface-600" />
              Kelas {member.kelas}
            </p>
          </div>

          {member.bio && (
            <p className="text-surface-500 text-xs leading-relaxed line-clamp-2 mb-3">
              {member.bio}
            </p>
          )}

          {/* Social links — pushed to bottom */}
          <div className="flex items-center gap-2 mt-auto">
            {member.github_url && (
              <span className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 text-xs group-hover:bg-surface-700 transition-colors">
                <i className="fa-brands fa-github" />
              </span>
            )}
            {member.linkedin_url && (
              <span className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 text-xs group-hover:bg-surface-700 transition-colors">
                <i className="fa-brands fa-linkedin" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
