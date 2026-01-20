import { useProgress } from '../context/ProgressContext';
import { useNotifications, createMotivationNotification, createReminderNotification } from '../context/NotificationContext';
import { tuls } from '../consts/tuls';
import { Trophy, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { achievements } from '../consts/achievements';
import { useEffect } from 'react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const {
    getProgressPercentage,
    getCompletedCount,
    getInProgressCount,
    currentBelt,
    tulProgress,
    unlockedAchievements,
    currentStreak,
    completedExams,
    studiedTheorySessions
  } = useProgress();

  // Notificaciones de bienvenida y motivación
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        addNotification(createMotivationNotification(
          '¡Bienvenido de vuelta! Cada día de práctica te acerca más a tu próximo cinturón.'
        ));
        localStorage.setItem('hasSeenWelcome', 'true');
      }, 2000);
    }

    // Recordatorios útiles
    if (currentStreak === 0 && completedCount > 0) {
      setTimeout(() => {
        addNotification(createReminderNotification(
          '¿Hace tiempo que no practicas? ¡Vuelve a tu rutina de Taekwondo!',
          'Ir a Tules',
          () => navigate('/tules')
        ));
      }, 5000);
    }

    if (completedCount >= 5 && unlockedAchievements.length === 0) {
      setTimeout(() => {
        addNotification(createReminderNotification(
          '¡Has completado varios tules! Revisa tus logros desbloqueados.',
          'Ver Logros',
          () => navigate('/achievements')
        ));
      }, 3000);
    }
  }, [addNotification, currentStreak, completedCount, unlockedAchievements.length, navigate]);

  const totalTuls = tuls.length;
  const completedCount = getCompletedCount();
  const inProgressCount = getInProgressCount();
  const progressPercentage = getProgressPercentage();

  // Calcular estadísticas adicionales
  const daysPracticing = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const streakDays = currentStreak;

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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Tu progreso en Taekwondo - Cinturón actual: <span className="font-semibold text-primary-500">{currentBelt.toUpperCase()}</span>
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg border border-gray-200 ${stat.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso general */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Progreso General</h2>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {completedCount} de {totalTuls} tuls completados
        </p>
      </div>

      {/* Próximos objetivos */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Próximos Objetivos</h2>
        <div className="space-y-3">
          {nextGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <p className="text-sm">{goal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Completaste el Tul #1</span>
            </div>
            <span className="text-xs text-gray-500">Hace 2 días</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Estudiaste vocabulario coreano</span>
            </div>
            <span className="text-xs text-gray-500">Hace 5 días</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Iniciaste el Tul #3</span>
            </div>
            <span className="text-xs text-gray-500">Hace 1 semana</span>
          </div>
        </div>
      </div>

      {/* Logros recientes */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
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
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aún no has desbloqueado logros</p>
            <p className="text-xs text-gray-400 mt-1">¡Sigue practicando para conseguirlos!</p>
          </div>
        )}
      </div>
    </section>
  );
};