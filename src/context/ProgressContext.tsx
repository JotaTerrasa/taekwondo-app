import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Achievement, UserAchievement, getAchievementStats, achievements } from '../consts/achievements';

export type TulStatus = 'not_started' | 'in_progress' | 'completed';

type TulProgress = Record<string, TulStatus>;

type ProgressContextType = {
  currentBelt: string;
  setCurrentBelt: (belt: string) => void;
  tulProgress: TulProgress;
  setTulStatus: (tulId: string, status: TulStatus) => void;
  getTulStatus: (tulId: string) => TulStatus;
  getProgressPercentage: () => number;
  getCompletedCount: () => number;
  getInProgressCount: () => number;
  // Achievement system
  unlockedAchievements: UserAchievement[];
  availableAchievements: Achievement[];
  getAchievementProgress: (achievementId: string) => number;
  checkNewAchievements: () => UserAchievement[];
  completedExams: number;
  setCompletedExams: (count: number) => void;
  studiedTheorySessions: number;
  setStudiedTheorySessions: (count: number) => void;
  currentStreak: number;
  setCurrentStreak: (streak: number) => void;
  longestStreak: number;
  totalPracticeTime: number;
  setTotalPracticeTime: (time: number) => void;
  // Gamification system
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  addPoints: (points: number, reason: string) => void;
  getLevelProgress: () => number;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

type ProgressProviderProps = {
  children: ReactNode;
};

// Sistema de puntos y niveles
const POINTS_PER_TUL_COMPLETION = 50;
const POINTS_PER_ACHIEVEMENT = 25;

const getLevelFromPoints = (points: number): number => {
  return Math.floor(points / 100) + 1; // Nivel 1 cada 100 puntos
};

const getPointsForNextLevel = (currentLevel: number): number => {
  return currentLevel * 100; // 100 puntos por nivel
};

// Componente interno que usa ambos contextos
const ProgressProviderInner = ({ children }: ProgressProviderProps) => {
  const [currentBelt, setCurrentBeltState] = useState<string>(() => {
    const saved = localStorage.getItem('currentBelt');
    return saved || 'gup-9';
  });

  // Estado de gamificación
  const [totalPoints, setTotalPoints] = useState<number>(() => {
    const saved = localStorage.getItem('totalPoints');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Calcular nivel actual y puntos para siguiente nivel
  const currentLevel = getLevelFromPoints(totalPoints);
  const pointsToNextLevel = getPointsForNextLevel(currentLevel) - totalPoints;

  // Función para agregar puntos
  const addPoints = (points: number, _reason: string) => {
    setTotalPoints(prev => {
      const newTotal = prev + points;
      localStorage.setItem('totalPoints', newTotal.toString());

      return newTotal;
    });
  };

  // Calcular progreso hacia el siguiente nivel
  const getLevelProgress = () => {
    const currentLevelPoints = (currentLevel - 1) * 100;
    const progressPoints = totalPoints - currentLevelPoints;
    return Math.min((progressPoints / 100) * 100, 100);
  };

  const [tulProgress, setTulProgress] = useState<TulProgress>(() => {
    const saved = localStorage.getItem('tulProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Auto-otorgar puntos por actividades completadas
  useEffect(() => {
    const completedTuls = getCompletedCount();
    const savedCompletedTuls = localStorage.getItem('lastPointsCalculation_completedTuls');
    const lastCompletedTuls = savedCompletedTuls ? parseInt(savedCompletedTuls, 10) : 0;

    if (completedTuls > lastCompletedTuls) {
      const newTuls = completedTuls - lastCompletedTuls;
      addPoints(newTuls * POINTS_PER_TUL_COMPLETION, `Completar ${newTuls} tul(s)`);
      localStorage.setItem('lastPointsCalculation_completedTuls', completedTuls.toString());
    }
  }, [tulProgress]);

  useEffect(() => {
    const savedAchievements = localStorage.getItem('lastPointsCalculation_achievements');
    const lastAchievementCount = savedAchievements ? parseInt(savedAchievements, 10) : 0;

    if (unlockedAchievements.length > lastAchievementCount) {
      const newAchievements = unlockedAchievements.length - lastAchievementCount;
      addPoints(newAchievements * POINTS_PER_ACHIEVEMENT, `Desbloquear ${newAchievements} logro(s)`);
      localStorage.setItem('lastPointsCalculation_achievements', unlockedAchievements.length.toString());
    }
  }, [unlockedAchievements]);

  // Achievement system state
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedExams, setCompletedExamsState] = useState<number>(() => {
    const saved = localStorage.getItem('completedExams');
    return saved ? parseInt(saved) : 0;
  });

  const [studiedTheorySessions, setStudiedTheorySessionsState] = useState<number>(() => {
    const saved = localStorage.getItem('studiedTheorySessions');
    return saved ? parseInt(saved) : 0;
  });

  const [currentStreak, setCurrentStreakState] = useState<number>(() => {
    const saved = localStorage.getItem('currentStreak');
    return saved ? parseInt(saved) : 0;
  });

  const [longestStreak, setLongestStreakState] = useState<number>(() => {
    const saved = localStorage.getItem('longestStreak');
    return saved ? parseInt(saved) : 0;
  });

  const [totalPracticeTime, setTotalPracticeTimeState] = useState<number>(() => {
    const saved = localStorage.getItem('totalPracticeTime');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('currentBelt', currentBelt);
  }, [currentBelt]);

  useEffect(() => {
    localStorage.setItem('tulProgress', JSON.stringify(tulProgress));
  }, [tulProgress]);

  // Achievement system localStorage
  useEffect(() => {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem('completedExams', completedExams.toString());
  }, [completedExams]);

  useEffect(() => {
    localStorage.setItem('studiedTheorySessions', studiedTheorySessions.toString());
  }, [studiedTheorySessions]);

  useEffect(() => {
    localStorage.setItem('currentStreak', currentStreak.toString());
    if (currentStreak > longestStreak) {
      setLongestStreakState(currentStreak);
    }
  }, [currentStreak]);

  useEffect(() => {
    localStorage.setItem('longestStreak', longestStreak.toString());
  }, [longestStreak]);

  useEffect(() => {
    localStorage.setItem('totalPracticeTime', totalPracticeTime.toString());
  }, [totalPracticeTime]);

  const setCurrentBelt = (belt: string) => {
    setCurrentBeltState(belt);
  };

  const setTulStatus = (tulId: string, status: TulStatus) => {
    setTulProgress((prev) => ({
      ...prev,
      [tulId]: status,
    }));
  };

  const getTulStatus = (tulId: string): TulStatus => {
    return tulProgress[tulId] || 'not_started';
  };

  const getProgressPercentage = () => {
    const totalTuls = Object.keys(tulProgress).length;
    if (totalTuls === 0) return 0;
    const completed = Object.values(tulProgress).filter((s) => s === 'completed').length;
    return Math.round((completed / 17) * 100); // 17 tules en total
  };

  const getCompletedCount = () => {
    return Object.values(tulProgress).filter((s) => s === 'completed').length;
  };

  const getInProgressCount = () => {
    return Object.values(tulProgress).filter((s) => s === 'in_progress').length;
  };

  // Achievement system functions
  const setCompletedExams = (count: number) => {
    setCompletedExamsState(count);
  };

  const setStudiedTheorySessions = (count: number) => {
    setStudiedTheorySessionsState(count);
  };

  const setCurrentStreak = (streak: number) => {
    setCurrentStreakState(streak);
  };

  const setTotalPracticeTime = (time: number) => {
    setTotalPracticeTimeState(time);
  };

  const getAchievementProgress = (achievementId: string): number => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;

    const userAchievement = unlockedAchievements.find(ua => ua.achievementId === achievementId);
    return userAchievement ? 100 : 0; // Simplified - could be more complex for partial progress
  };

  const checkNewAchievements = (): UserAchievement[] => {
    const stats = getAchievementStats(
      getCompletedCount(),
      17, // total tuls
      completedExams,
      10, // assuming 10 exam types
      studiedTheorySessions,
      currentStreak,
      longestStreak,
      totalPracticeTime,
      new Date('2024-01-01') // joined date - could be stored
    );

    const newAchievements: UserAchievement[] = [];

    achievements.forEach(achievement => {
      const alreadyUnlocked = unlockedAchievements.some(ua => ua.achievementId === achievement.id);
      if (!alreadyUnlocked && achievement.condition(stats)) {
        const newAchievement: UserAchievement = {
          achievementId: achievement.id,
          unlockedAt: new Date(),
        };
        newAchievements.push(newAchievement);
        setUnlockedAchievements(prev => [...prev, newAchievement]);
      }
    });

    return newAchievements;
  };

  const availableAchievements = achievements.filter(achievement => {
    return !unlockedAchievements.some(ua => ua.achievementId === achievement.id);
  });

  return (
    <ProgressContext.Provider
      value={{
        currentBelt,
        setCurrentBelt,
        tulProgress,
        setTulStatus,
        getTulStatus,
        getProgressPercentage,
        getCompletedCount,
        getInProgressCount,
        // Achievement system
        unlockedAchievements,
        availableAchievements,
        getAchievementProgress,
        checkNewAchievements,
        completedExams,
        setCompletedExams,
        studiedTheorySessions,
        setStudiedTheorySessions,
        currentStreak,
        setCurrentStreak,
        longestStreak,
        totalPracticeTime,
        setTotalPracticeTime,
        // Gamification system
        totalPoints,
        currentLevel,
        pointsToNextLevel,
        addPoints,
        getLevelProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

// Nuevo provider que incluye notificaciones
export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  return (
    <ProgressProviderInner>
      <ProgressNotificationHandler>
        {children}
      </ProgressNotificationHandler>
    </ProgressProviderInner>
  );
};

// Componente que maneja las notificaciones de progreso
const ProgressNotificationHandler = ({ children }: { children: ReactNode }) => {
  const { unlockedAchievements, checkNewAchievements, totalPoints, currentLevel } = useProgress();
  const { addNotification } = useNotifications();

  // Estado para trackear el último nivel notificado
  const [lastNotifiedLevel, setLastNotifiedLevel] = useState(currentLevel);

  useEffect(() => {
    const newAchievements = checkNewAchievements();
    newAchievements.forEach(achievement => {
      const achievementData = achievements.find(a => a.id === achievement.achievementId);
      if (achievementData) {
        addNotification(createAchievementNotification(achievementData.title));
      }
    });
  }, [unlockedAchievements, checkNewAchievements, addNotification]);

  // Notificar subida de nivel
  useEffect(() => {
    const newLevel = getLevelFromPoints(totalPoints);
    if (newLevel > lastNotifiedLevel && newLevel > 1) {
      addNotification({
        type: 'milestone',
        title: '🎉 ¡Subiste de Nivel!',
        message: `Felicidades! Alcanzaste el nivel ${newLevel}. ¡Sigue practicando!`,
        icon: <Star className="w-5 h-5" style={{ color: 'var(--warning-color)' }} />
      });
      setLastNotifiedLevel(newLevel);
    }
  }, [totalPoints, lastNotifiedLevel, addNotification]);

  return <>{children}</>;
};
