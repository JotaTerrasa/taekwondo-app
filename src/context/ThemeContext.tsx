import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark'; // El tema efectivo (resolviendo 'system')
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Intentar recuperar el tema guardado
    const saved = localStorage.getItem('theme');
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved as Theme;
    }
    // Por defecto usar 'system'
    return 'system';
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    // Detectar el tema del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Escuchar cambios en el tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calcular el tema efectivo
  const effectiveTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  // Aplicar el tema al documento
  useEffect(() => {
    const root = document.documentElement;

    // Remover clases anteriores
    root.classList.remove('light', 'dark');

    // Agregar la clase del tema efectivo
    root.classList.add(effectiveTheme);

    // También guardar en data-theme para CSS personalizado
    root.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        effectiveTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};