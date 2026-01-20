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

// Componente interno que usa ambos contextos
const ProgressProviderInner = ({ children }: ProgressProviderProps) => {
  const [currentBelt, setCurrentBeltState] = useState<string>(() => {
    const saved = localStorage.getItem('currentBelt');
    return saved || 'gup-9';
  });

  const [tulProgress, setTulProgress] = useState<TulProgress>(() => {
    const saved = localStorage.getItem('tulProgress');
    return saved ? JSON.parse(saved) : {};
  });

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
  const { unlockedAchievements, checkNewAchievements } = useProgress();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const newAchievements = checkNewAchievements();
    newAchievements.forEach(achievement => {
      const achievementData = achievements.find(a => a.id === achievement.achievementId);
      if (achievementData) {
        addNotification(createAchievementNotification(achievementData.title));
      }
    });
  }, [unlockedAchievements, checkNewAchievements, addNotification]);

  return <>{children}</>;
};
