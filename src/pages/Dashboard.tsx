import { useProgress } from '../context/ProgressContext';
import { tuls } from '../consts/tuls';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { achievements } from '../consts/achievements';

export const Dashboard = () => {
  const {
    getProgressPercentage,
    getCompletedCount,
    getInProgressCount,
    currentBelt,
    unlockedAchievements,
    currentStreak
  } = useProgress();

  const totalTuls = tuls.length;
  const completedCount = getCompletedCount();
  const inProgressCount = getInProgressCount();
  const progressPercentage = getProgressPercentage();

  // Estadísticas calculadas

  // Logros recientes (últimos 3 desbloqueados)
  const recentAchievements = unlockedAchievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3)
    .map(ua => achievements.find(a => a.id === ua.achievementId)!)
    .filter(Boolean);

  const stats = [
    {
      title: 'Progreso Total',
      value: `${progressPercentage}%`,
      icon: <Target className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tuls Completados',
      value: `${completedCount}/${totalTuls}`,
      icon: <Trophy className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'En Progreso',
      value: inProgressCount.toString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Logros',
      value: `${unlockedAchievements.length}`,
      icon: <Award className="w-6 h-6" />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  // Próximos objetivos
  const nextGoals = [
    'Completar 3 tuls más para subir de cinturón',
    'Estudiar vocabulario de técnicas avanzadas',
    'Practicar exámenes de cinturón negro'
  ];

  return (
    <section className="flex flex-col gap-6 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Tu progreso en Taekwondo - Cinturón actual: <span className="font-semibold text-primary-500">{currentBelt.toUpperCase()}</span>
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 rounded-lg border transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
              <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.title}</p>
                <p className="text-2xl font-bold" style={{ color: stat.color.includes('green') ? 'var(--success-color)' : stat.color.includes('blue') ? 'var(--info-color)' : stat.color.includes('orange') ? 'var(--warning-color)' : stat.color.includes('yellow') ? 'var(--warning-color)' : 'var(--text-primary)' }}>{stat.value}</p>
              </div>
              <div style={{ color: stat.color.includes('green') ? 'var(--success-color)' : stat.color.includes('blue') ? 'var(--info-color)' : stat.color.includes('orange') ? 'var(--warning-color)' : stat.color.includes('yellow') ? 'var(--warning-color)' : 'var(--text-primary)' }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso general */}
      <div className="p-6 border rounded-lg transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Progreso General</h2>
        <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
          {completedCount} de {totalTuls} tuls completados
        </p>
      </div>

      {/* Próximos objetivos */}
      <div className="p-6 border rounded-lg transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Próximos Objetivos</h2>
        <div className="space-y-3">
          {nextGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{goal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="p-6 border rounded-lg transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success-color)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Completaste el Tul #1</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Hace 2 días</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--info-color)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Estudiaste vocabulario coreano</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Hace 5 días</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--warning-color)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Iniciaste el Tul #3</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Hace 1 semana</span>
          </div>
        </div>
      </div>

      {/* Logros recientes */}
      <div className="p-6 border rounded-lg transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Award className="w-5 h-5" style={{ color: 'var(--warning-color)' }} />
            Logros Recientes
          </h2>
          <Link
            to="/achievements"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {recentAchievements.length > 0 ? (
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{achievement.title}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{achievement.description}</p>
                </div>
                <Trophy className="w-4 h-4" style={{ color: 'var(--warning-color)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Aún no has desbloqueado logros</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>¡Sigue practicando para conseguirlos!</p>
          </div>
        )}
      </div>
    </section>
  );
};