import InstanceBadge from '../ui/InstanceBadge';

interface FooterProps {
  serverId?: string;
  serverName?: string;
}

export default function Footer({ serverId = '1', serverName = 'WebServer-Instance-1' }: FooterProps) {
  return (
    <footer className="relative bg-surface-950 border-t border-surface-800/50">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-1">
            <span className="font-display text-3xl tracking-wider text-white">GOAT</span>
            <span className="font-display text-3xl tracking-wider text-surface-600">STENSI</span>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-surface-800" />

          {/* Info */}
          <p className="text-surface-500 text-sm text-center">
            © 2026 TUGAS BESAR BBK3CAB3 · Komputasi Awan · Telkom University
          </p>

          {/* Instance indicator */}
          <div className="flex items-center gap-3 text-surface-600 text-xs">
            <InstanceBadge serverId={serverId} size="sm" />
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{serverName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
