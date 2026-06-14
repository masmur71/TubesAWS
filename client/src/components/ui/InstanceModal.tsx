import { useEffect, useRef } from 'react';
import type { ServerInfo } from '../../types';

interface InstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverInfo: ServerInfo | null;
  nodeVersion?: string;
  environment?: string;
}

export default function InstanceModal({ isOpen, onClose, serverInfo, nodeVersion, environment }: InstanceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const infoRows = [
    { icon: 'fa-hashtag', label: 'Server ID', value: `#${serverInfo?.serverId || '—'}`, color: '' },
    { icon: 'fa-desktop', label: 'Server Name', value: serverInfo?.serverName || '—', color: '' },
    { icon: 'fa-clock', label: 'Uptime', value: serverInfo?.uptime ? `${parseFloat(serverInfo.uptime).toFixed(0)}s` : '—', color: '' },
    { icon: 'fa-code-branch', label: 'Environment', value: environment || '—', color: '' },
    { icon: 'fa-network-wired', label: 'Load Balancer', value: 'ACTIVE', color: 'text-emerald-500', isActive: true },
  ];

  if (nodeVersion) {
    infoRows.splice(3, 0, { icon: 'fa-brands fa-node-js', label: 'Node.js Version', value: nodeVersion, color: 'text-surface-300' });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="bg-surface-950 border border-surface-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800">
          <h3 className="font-display text-xl tracking-wider text-white flex items-center gap-2">
            <i className="fa-solid fa-server text-emerald-500" />
            DETAIL INSTANCE AKTIF
          </h3>
          <button
            onClick={onClose}
            className="text-surface-500 hover:text-white transition-colors text-lg p-1"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-surface-900 last:border-b-0">
              <span className="text-surface-400 text-sm flex items-center gap-2">
                <i className={`fa-solid ${row.icon} w-4 text-center ${row.color}`} />
                {row.label}
              </span>
              {'isActive' in row && row.isActive ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500 text-sm font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {row.value}
                </span>
              ) : (
                <span className="bg-surface-900 border border-surface-800 rounded-lg px-3 py-1 text-white text-sm font-medium">
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
