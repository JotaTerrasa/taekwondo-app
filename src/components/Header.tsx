import { Menu } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="relative z-40 flex items-center justify-between flex-none mx-6 my-4 safe-area-top">
      <a href="/">
        <img src="/imgs/logo.webp" width={80} alt="Logo de la escuela RAM" />
      </a>

      <div className="flex items-center gap-3">
        <NotificationPanel />
        <button
          onClick={onMenuToggle}
          className="p-2 transition-colors duration-200 rounded-lg theme-hover"
          style={{ color: 'var(--text-primary)' }}
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
