import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InstanceBadge from '../ui/InstanceBadge';
import InstanceModal from '../ui/InstanceModal';
import { useServerInfo } from '../../hooks/useServerInfo';

interface NavbarProps {
  serverId?: string;
  serverName?: string;
  nodeVersion?: string;
  environment?: string;
}

export default function Navbar({ serverId, serverName: _serverName, nodeVersion, environment }: NavbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const { serverInfo } = useServerInfo();

  const effectiveServerId = serverId || serverInfo?.serverId || '1';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-surface-950/95 backdrop-blur-xl border-b border-surface-800/50 shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand */}
            <Link to="/dashboard" className="flex items-center gap-1 group">
              <span className="font-display text-2xl sm:text-3xl tracking-wider text-white group-hover:text-brand-400 transition-colors">
                GOAT
              </span>
              <span className="font-display text-2xl sm:text-3xl tracking-wider text-surface-500 group-hover:text-surface-300 transition-colors">
                STENSI
              </span>
            </Link>

            {/* Center: Instance Badge (desktop) */}
            <div className="hidden md:flex items-center">
              <InstanceBadge
                serverId={effectiveServerId}
                onClick={() => setShowInstanceModal(true)}
              />
            </div>

            {/* Right: Nav links (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm tracking-wider uppercase transition-colors ${
                  location.pathname === '/dashboard' ? 'text-brand-400' : 'text-surface-400 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-house mr-1.5" />
                Dashboard
              </Link>

              <div className="h-5 w-px bg-surface-700" />

              <div className="flex items-center gap-3">
                <span className="text-surface-400 text-sm">
                  <i className="fa-solid fa-circle-user mr-1" />
                  {user?.username || 'Guest'}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs tracking-wider uppercase text-surface-400 hover:text-white border border-surface-700 hover:border-surface-500 rounded-lg transition-all duration-300 hover:bg-surface-800"
                >
                  <i className="fa-solid fa-right-from-bracket mr-1" />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileOpen ? 'max-h-80 pb-6' : 'max-h-0'}`}>
            <div className="space-y-3 pt-2 border-t border-surface-800">
              <InstanceBadge
                serverId={effectiveServerId}
                onClick={() => setShowInstanceModal(true)}
                size="sm"
              />
              <Link
                to="/dashboard"
                className="block text-sm tracking-wider uppercase text-surface-300 hover:text-white py-2 transition-colors"
              >
                <i className="fa-solid fa-house mr-2" />
                Dashboard
              </Link>
              <div className="flex items-center justify-between pt-2 border-t border-surface-800">
                <span className="text-surface-400 text-sm">
                  <i className="fa-solid fa-circle-user mr-1" />
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="text-xs tracking-wider uppercase text-red-400 hover:text-red-300 transition-colors"
                >
                  <i className="fa-solid fa-right-from-bracket mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <InstanceModal
        isOpen={showInstanceModal}
        onClose={() => setShowInstanceModal(false)}
        serverInfo={serverInfo}
        nodeVersion={nodeVersion}
        environment={environment}
      />
    </>
  );
}
