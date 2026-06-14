interface InstanceBadgeProps {
  serverId: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export default function InstanceBadge({ serverId, onClick, size = 'md' }: InstanceBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1 text-[10px] gap-1.5'
    : 'px-3.5 py-1.5 text-xs gap-2';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center ${sizeClasses} bg-emerald-500/10 border border-emerald-500/20 rounded-full font-mono tracking-widest uppercase transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] cursor-pointer group`}
      title="Klik untuk lihat detail server"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-surface-400 group-hover:text-surface-300 transition-colors">Instance</span>
      <span className="text-emerald-400 font-bold">#{serverId}</span>
    </button>
  );
}
