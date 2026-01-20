import { useProgress } from '../context/ProgressContext';
import { achievements, getRarityColor, getRarityLabel, Achievement } from '../consts/achievements';
import { Trophy, Lock, Star } from 'lucide-react';

export const Achievements = () => {
  const {
    unlockedAchievements,
    availableAchievements,
    getAchievementProgress
  } = useProgress();

  const unlockedAchievementObjects = unlockedAchievements.map(ua =>
    achievements.find(a => a.id === ua.achievementId)!
  ).filter(Boolean);

  const AchievementCard = ({
    achievement,
    isUnlocked,
    unlockedAt
  }: {
    achievement: Achievement;
    isUnlocked: boolean;
    unlockedAt?: Date;
  }) => (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isUnlocked
          ? 'border-green-200 bg-green-50 shadow-md'
          : 'theme-border theme-bg-card opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>
          {isUnlocked ? achievement.icon : '🔒'}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${isUnlocked ? 'theme-text-primary' : 'theme-text-muted'}`}>
              {achievement.title}
            </h3>
            {isUnlocked && (
              <Trophy className="w-4 h-4 text-yellow-500" />
            )}
          </div>

          <p className={`text-sm mb-2 ${isUnlocked ? 'theme-text-primary' : 'theme-text-muted'}`}>
            {achievement.description}
          </p>

          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
              {getRarityLabel(achievement.rarity)}
            </span>

            {isUnlocked && unlockedAt && (
              <span className="text-xs theme-text-muted">
                Desbloqueado {unlockedAt.toLocaleDateString()}
              </span>
            )}
          </div>

          {achievement.reward && isUnlocked && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-700">
                  {achievement.reward.title}
                </span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                {achievement.reward.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col gap-6 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Logros</h1>
        <p className="theme-text-secondary">
          Tu colección de logros desbloqueados - {unlockedAchievements.length} de {achievements.length} completados
        </p>
      </div>

      {/* Progress Overview */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Progreso General</h2>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-lg">
              {unlockedAchievements.length}/{achievements.length}
            </span>
          </div>
        </div>

        <div className="w-full theme-bg-tertiary rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-sm theme-text-secondary">
          {achievements.length - unlockedAchievements.length} logros restantes por desbloquear
        </p>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievementObjects.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Logros Desbloqueados ({unlockedAchievementObjects.length})
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievementObjects.map((achievement) => {
              const userAchievement = unlockedAchievements.find(ua => ua.achievementId === achievement.id);
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={true}
                  unlockedAt={userAchievement?.unlockedAt}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Available Achievements */}
      {availableAchievements.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 theme-text-muted" />
            Logros Disponibles ({availableAchievements.length})
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {unlockedAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 theme-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold theme-text-secondary mb-2">
            ¡Comienza tu colección de logros!
          </h3>
          <p className="theme-text-muted">
            Completa tuls, estudia teoría y supera exámenes para desbloquear logros.
          </p>
        </div>
      )}
    </section>
  );
};