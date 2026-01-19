import { Book, Paperclip, User, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';

type NavItem = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

type MenuMobileProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export const MenuMobile = ({ isOpen, onClose, onLogout }: MenuMobileProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      to: '/',
      icon: <Book />,
      label: 'Exámenes',
    },
    {
      to: '/tules',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      label: 'Tules',
    },
    {
      to: '/theory',
      icon: <Paperclip />,
      label: 'Teoría',
    },
    {
      to: '/account',
      icon: <User />,
      label: 'Perfil',
    },
  ];

  return (
    <div
      className={`fixed inset-0 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <header className="flex items-center justify-between flex-none w-full p-2 border-b safe-area-top transition-colors" style={{ borderColor: 'var(--border-color)' }}>
        <a href="/">
          <img src="/imgs/logo.webp" width={80} alt="logo escuela" />
        </a>

        <button
          onClick={onClose}
          type="button"
          className="p-2 transition-colors duration-200 rounded-lg"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Cerrar menú"
        >
          <X width={24} height={24} style={{ color: 'var(--text-primary)' }} />
        </button>
      </header>

      <nav className="flex flex-col flex-1 py-6 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-4 px-6 py-4 transition-all duration-200"
              style={{
                animation: isOpen
                  ? `slideIn 0.3s ease-out ${index * 0.05}s both`
                  : 'none',
                backgroundColor: isActive ? 'rgba(128, 0, 0, 0.1)' : 'transparent',
                color: isActive ? '#800000' : 'var(--text-primary)',
                borderLeft: isActive ? '4px solid #800000' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="shrink-0" style={{ color: isActive ? '#800000' : 'var(--text-primary)' }}>{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-none px-6 pt-4 pb-6 border-t safe-area-bottom transition-colors" style={{ borderColor: 'var(--border-color)' }}>
        <Button handleClick={onLogout}>Cerrar sesión</Button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
