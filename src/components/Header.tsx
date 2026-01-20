import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="relative z-40 flex items-center justify-between flex-none mx-6 my-4 safe-area-top">
      <a href="/">
        <img src="/imgs/logo.webp" width={80} alt="Logo de la escuela RAM" />
      </a>

      <button
        onClick={onMenuToggle}
        className="transition-colors duration-200 rounded-lg"
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
      </button>
    </header>
  );
};
