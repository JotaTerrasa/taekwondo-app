import { useState, useEffect, useRef } from 'react';
import { Edit, User, Award, Sun, Moon, Monitor } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { exams } from '../consts/exams';

export const Account = () => {
  const { currentBelt, setCurrentBelt, getCompletedCount, getInProgressCount } = useProgress();
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentExam = exams.find((e) => e.id === currentBelt);

  useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    } else {
      // Datos por defecto del usuario de prueba
      const defaultData = {
        name: 'Usuario de Prueba',
        email: 'example@example.com',
        avatar: '',
      };
      setProfileData(defaultData);
      localStorage.setItem('profileData', JSON.stringify(defaultData));
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfileData = {
          ...profileData,
          avatar: reader.result as string,
        };
        setProfileData(newProfileData);
        localStorage.setItem('profileData', JSON.stringify(newProfileData));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    const newProfileData = {
      ...profileData,
      [field]: value,
    };
    setProfileData(newProfileData);
    localStorage.setItem('profileData', JSON.stringify(newProfileData));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col items-center w-full gap-6 py-8">
        {/* Foto de perfil */}
        <div className="relative">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative flex items-center justify-center w-32 h-32 overflow-hidden transition-colors border-4 rounded-full hover:border-primary-500"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)'
            }}
            aria-label="Cambiar foto de perfil"
          >
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="Foto de perfil"
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-16 h-16" style={{ color: 'var(--text-muted)' }} />
            )}
          </button>
          <div className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 border-2 border-white rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }}>
            <Edit width={16} height={16} style={{ color: 'var(--text-primary)' }} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Seleccionar imagen de perfil"
          />
        </div>

        {/* Formulario de datos */}
        <div className="flex flex-col w-full gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Nombre</span>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--border-color)'
              }}
              placeholder="Tu nombre"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Correo electrónico
            </span>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--border-color)'
              }}
              placeholder="tu@email.com"
            />
          </label>

          {/* Selector de cinturón */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Cinturón actual
            </span>
            <div className="flex items-center gap-3 p-3 border rounded-md transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              {currentExam && (
                <img src={currentExam.img} alt={currentExam.range} className="w-16" />
              )}
              <select
                value={currentBelt}
                onChange={(e) => setCurrentBelt(e.target.value)}
                className="flex-1 h-10 px-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id} style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    {exam.range}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de tema */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Tema de la aplicación
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: theme === 'light' ? 'var(--accent-primary)' : 'var(--input-bg)',
                  borderColor: theme === 'light' ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: theme === 'light' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Sun className="w-6 h-6" style={{ color: theme === 'light' ? 'white' : 'var(--text-muted)' }} />
                <span className="text-xs font-medium">Claro</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--accent-primary)' : 'var(--input-bg)',
                  borderColor: theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: theme === 'dark' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Moon className="w-6 h-6" style={{ color: theme === 'dark' ? 'white' : 'var(--text-muted)' }} />
                <span className="text-xs font-medium">Oscuro</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: theme === 'system' ? 'var(--accent-primary)' : 'var(--input-bg)',
                  borderColor: theme === 'system' ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: theme === 'system' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Monitor className="w-6 h-6" style={{ color: theme === 'system' ? 'white' : 'var(--text-muted)' }} />
                <span className="text-xs font-medium">Sistema</span>
              </button>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Tema actual: <span className="font-medium">
                {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : `Sistema (${effectiveTheme === 'dark' ? 'Oscuro' : 'Claro'})`}
              </span>
            </p>
          </div>
        </div>

        {/* Estadísticas de progreso */}
        <div className="flex flex-col gap-3 p-4 mt-4 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Tu progreso</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 rounded-md transition-colors" style={{ backgroundColor: 'var(--card-bg)', boxShadow: '0 1px 3px var(--shadow)', border: '1px solid var(--border-color)' }}>
              <span className="text-2xl font-bold text-green-600">{getCompletedCount()}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tules completados</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-md transition-colors" style={{ backgroundColor: 'var(--card-bg)', boxShadow: '0 1px 3px var(--shadow)', border: '1px solid var(--border-color)' }}>
              <span className="text-2xl font-bold text-amber-500">{getInProgressCount()}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>En progreso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
