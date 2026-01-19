import { useProgress } from '../context/ProgressContext';
import { tuls } from '../consts/tuls';
import { Trophy, Target, TrendingUp, Calendar } from 'lucide-react';

export const Dashboard = () => {
  const {
    getProgressPercentage,
    getCompletedCount,
    getInProgressCount,
    currentBelt,
    tulProgress
  } = useProgress();

  const totalTuls = tuls.length;
  const completedCount = getCompletedCount();
  const inProgressCount = getInProgressCount();
  const progressPercentage = getProgressPercentage();

  // Calcular estadísticas adicionales
  const daysPracticing = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)); // Simulado
  const streakDays = 7; // Simulado - se podría calcular basado en actividad real

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
      title: 'Racha Actual',
      value: `${streakDays} días`,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
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
    </section>
  );
};