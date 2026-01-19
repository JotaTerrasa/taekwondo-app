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
            className="relative flex items-center justify-center w-32 h-32 overflow-hidden transition-colors bg-gray-200 border-4 border-gray-300 rounded-full hover:border-primary-500"
            aria-label="Cambiar foto de perfil"
          >
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="Foto de perfil"
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </button>
          <div className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 border-2 border-white rounded-full bg-primary-500">
            <Edit width={16} height={16} color="#ffffff" />
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
            <span className="text-sm font-medium text-gray-700">Nombre</span>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}
              placeholder="Tu nombre"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Correo electrónico
            </span>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}
              placeholder="tu@email.com"
            />
          </label>

          {/* Selector de cinturón */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Cinturón actual
            </span>
            <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md">
              {currentExam && (
                <img src={currentExam.img} alt={currentExam.range} className="w-16" />
              )}
              <select
                value={currentBelt}
                onChange={(e) => setCurrentBelt(e.target.value)}
                className="flex-1 h-10 px-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
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
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: theme === 'light' ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                  borderColor: theme === 'light' ? '#800000' : 'var(--border-color)',
                  color: theme === 'light' ? '#800000' : 'var(--text-primary)'
                }}
              >
                <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className="text-xs font-medium">Claro</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                  borderColor: theme === 'dark' ? '#800000' : 'var(--border-color)',
                  color: theme === 'dark' ? '#800000' : 'var(--text-primary)'
                }}
              >
                <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className="text-xs font-medium">Oscuro</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  theme === 'system'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: theme === 'system' ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                  borderColor: theme === 'system' ? '#800000' : 'var(--border-color)',
                  color: theme === 'system' ? '#800000' : 'var(--text-primary)'
                }}
              >
                <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-primary-500' : 'text-gray-400'}`} />
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
        <div className="flex flex-col gap-3 p-4 mt-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-gray-800">Tu progreso</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 rounded-md" style={{ backgroundColor: 'var(--card-bg)', boxShadow: '0 1px 3px var(--shadow)' }}>
              <span className="text-2xl font-bold text-green-600">{getCompletedCount()}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tules completados</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-md" style={{ backgroundColor: 'var(--card-bg)', boxShadow: '0 1px 3px var(--shadow)' }}>
              <span className="text-2xl font-bold text-amber-500">{getInProgressCount()}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>En progreso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
