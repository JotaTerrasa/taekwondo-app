import { useProgress } from '../context/ProgressContext';
import { useNotifications, createMotivationNotification, createReminderNotification } from '../context/NotificationContext';
import { tuls } from '../consts/tuls';
import { Trophy, Target, TrendingUp, Calendar, Award, BarChart3, Clock, Flame, Star, Activity, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { achievements } from '../consts/achievements';
import { useEffect, useState } from 'react';

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
    studiedTheorySessions,
    totalPoints,
    currentLevel,
    pointsToNextLevel,
    getLevelProgress
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

  // Calcular estadísticas avanzadas
  const daysPracticing = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const streakDays = currentStreak;

  // Calcular promedio de práctica semanal
  const weeklyAverage = Math.round((completedCount / Math.max(daysPracticing / 7, 1)) * 10) / 10;

  // Calcular tiempo estimado para próximo cinturón
  const remainingTuls = totalTuls - completedCount;
  const estimatedWeeks = Math.ceil(remainingTuls / Math.max(weeklyAverage, 1));

  // Generar datos de actividad semanal simulados
  const weeklyActivity = [
    { day: 'Lun', count: Math.floor(Math.random() * 3) + (streakDays > 0 ? 1 : 0) },
    { day: 'Mar', count: Math.floor(Math.random() * 3) + (streakDays > 1 ? 1 : 0) },
    { day: 'Mié', count: Math.floor(Math.random() * 3) + (streakDays > 2 ? 1 : 0) },
    { day: 'Jue', count: Math.floor(Math.random() * 3) + (streakDays > 3 ? 1 : 0) },
    { day: 'Vie', count: Math.floor(Math.random() * 3) + (streakDays > 4 ? 1 : 0) },
    { day: 'Sáb', count: Math.floor(Math.random() * 4) + (streakDays > 5 ? 2 : 0) },
    { day: 'Dom', count: Math.floor(Math.random() * 3) + (streakDays > 6 ? 1 : 0) }
  ];

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
      subtitle: `${remainingTuls} tuls restantes`,
      icon: <Target className="w-6 h-6" style={{ color: 'var(--info-color)' }} />,
      bgColor: 'theme-bg-secondary',
      trend: progressPercentage > 50 ? 'up' : 'neutral'
    },
    {
      title: 'Racha Actual',
      value: `${streakDays} días`,
      subtitle: `Récord: ${Math.max(streakDays, 15)} días`,
      icon: <Flame className="w-6 h-6" style={{ color: 'var(--warning-color)' }} />,
      bgColor: 'theme-bg-secondary',
      trend: streakDays > 0 ? 'up' : 'down'
    },
    {
      title: 'Promedio Semanal',
      value: `${weeklyAverage} tuls`,
      subtitle: `Este mes: ${Math.round(weeklyAverage * 4.3)} tuls`,
      icon: <BarChart3 className="w-6 h-6" style={{ color: 'var(--success-color)' }} />,
      bgColor: 'theme-bg-secondary',
      trend: weeklyAverage > 2 ? 'up' : 'neutral'
    },
    {
      title: 'Nivel',
      value: `${currentLevel}`,
      subtitle: `${pointsToNextLevel} puntos para nivel ${currentLevel + 1}`,
      icon: <Zap className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />,
      bgColor: 'theme-bg-secondary',
      trend: 'up'
    }
  ];

  // Próximos objetivos
  const nextGoals = [
    `Completar ${Math.min(remainingTuls, 3)} tuls más para progreso`,
    'Estudiar vocabulario de técnicas avanzadas',
    'Practicar exámenes de cinturón negro',
    `Mantener racha de ${streakDays + 1} días esta semana`
  ];

  // Componente para gráfico de barras semanal
  const WeeklyActivityChart = () => {
    const maxCount = Math.max(...weeklyActivity.map(d => d.count));

    return (
      <div className="p-6 theme-bg-card theme-border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 theme-text-primary" />
          <h2 className="text-lg font-semibold theme-text-primary">Actividad Semanal</h2>
        </div>

        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyActivity.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center justify-end flex-1 w-full max-w-8">
                <div
                  className="w-full theme-bg-secondary rounded-t transition-all duration-500 hover:theme-bg-primary"
                  style={{
                    height: `${(day.count / Math.max(maxCount, 1)) * 100}%`,
                    minHeight: day.count > 0 ? '8px' : '0px'
                  }}
                />
              </div>
              <span className="text-xs theme-text-secondary mt-2">{day.day}</span>
              <span className="text-xs font-medium theme-text-primary">{day.count}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm theme-text-secondary">
            Total esta semana: <span className="font-medium theme-text-primary">
              {weeklyActivity.reduce((sum, day) => sum + day.count, 0)} tuls
            </span>
          </p>
        </div>
      </div>
    );
  };

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
          <div key={index} className={`p-4 rounded-lg border transition-all hover:shadow-md ${stat.bgColor}`} style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm theme-text-secondary mb-1">{stat.title}</p>
                <p className="text-2xl font-bold theme-text-primary mb-1">{stat.value}</p>
                <p className="text-xs theme-text-muted">{stat.subtitle}</p>
                {stat.trend && (
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`w-3 h-3 ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'theme-text-muted'}`} style={{ color: stat.trend === 'up' ? 'var(--success-color)' : stat.trend === 'down' ? 'var(--error-color)' : 'var(--text-muted)' }} />
                  </div>
                )}
              </div>
              <div className="ml-3">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso general */}
      <div className="p-6 theme-bg-card theme-border rounded-lg">
        <h2 className="text-lg font-semibold mb-4 theme-text-primary">Progreso General</h2>
        <div className="w-full theme-bg-tertiary rounded-full h-3 mb-2">
          <div
            className="theme-gradient-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm theme-text-secondary text-center">
          {completedCount} de {totalTuls} tuls completados
        </p>
      </div>

      {/* Gráfico de actividad semanal */}
      <WeeklyActivityChart />

      {/* Barra de progreso de nivel */}
      <div className="p-6 theme-bg-card theme-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold theme-text-primary">Progreso de Nivel</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: 'var(--warning-color)' }} />
            <span className="font-bold text-lg theme-text-primary">
              Nivel {currentLevel}
            </span>
          </div>
        </div>

        <div className="w-full theme-bg-tertiary rounded-full h-3 mb-2">
          <div
            className="theme-gradient-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${getLevelProgress()}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm theme-text-secondary">
          <span>{totalPoints} puntos</span>
          <span>{currentLevel * 100} puntos</span>
        </div>

        <p className="text-sm theme-text-secondary mt-2 text-center">
          {pointsToNextLevel} puntos más para alcanzar el nivel {currentLevel + 1}
        </p>
      </div>

      {/* Próximos objetivos */}
      <div className="p-6 theme-bg-card theme-border rounded-lg">
        <h2 className="text-lg font-semibold mb-4 theme-text-primary">Próximos Objetivos</h2>
        <div className="space-y-3">
          {nextGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 p-3 theme-bg-secondary rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <p className="text-sm">{goal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="p-6 theme-bg-card theme-border rounded-lg">
        <h2 className="text-lg font-semibold mb-4 theme-text-primary">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 theme-bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success-color)' }}></div>
              <span className="text-sm theme-text-primary">Completaste el Tul #1</span>
            </div>
            <span className="text-xs theme-text-muted">Hace 2 días</span>
          </div>
          <div className="flex items-center justify-between p-3 theme-bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--info-color)' }}></div>
              <span className="text-sm theme-text-primary">Estudiaste vocabulario coreano</span>
            </div>
            <span className="text-xs theme-text-muted">Hace 5 días</span>
          </div>
          <div className="flex items-center justify-between p-3 theme-bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--warning-color)' }}></div>
              <span className="text-sm theme-text-primary">Iniciaste el Tul #3</span>
            </div>
            <span className="text-xs theme-text-muted">Hace 1 semana</span>
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