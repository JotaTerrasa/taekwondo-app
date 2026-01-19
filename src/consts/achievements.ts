export type AchievementType = 'tul_completion' | 'theory_study' | 'exam_passed' | 'streak' | 'dedication';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: AchievementType;
  condition: (stats: AchievementStats) => boolean;
  reward?: {
    title: string;
    description: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type AchievementStats = {
  completedTuls: number;
  totalTuls: number;
  completedExams: number;
  totalExams: number;
  studiedTheorySessions: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeTime: number; // in minutes
  joinedDate: Date;
};

export type UserAchievement = {
  achievementId: string;
  unlockedAt: Date;
  progress?: number; // for progress tracking
};

// Achievement definitions
export const achievements: Achievement[] = [
  // Tul Completion Achievements
  {
    id: 'first_tul',
    title: 'Primer Paso',
    description: 'Completa tu primer tul',
    icon: '🥋',
    type: 'tul_completion',
    condition: (stats) => stats.completedTuls >= 1,
    rarity: 'common',
    reward: {
      title: 'Principiante',
      description: 'Has dado tu primer paso en el camino del Taekwondo'
    }
  },
  {
    id: 'tul_enthusiast',
    title: 'Entusiasta de las Formas',
    description: 'Completa 5 tuls',
    icon: '⚡',
    type: 'tul_completion',
    condition: (stats) => stats.completedTuls >= 5,
    rarity: 'common',
    reward: {
      title: 'Entusiasta',
      description: 'Tu dedicación a las formas es admirable'
    }
  },
  {
    id: 'tul_master',
    title: 'Maestro de Formas',
    description: 'Completa 10 tuls',
    icon: '👑',
    type: 'tul_completion',
    condition: (stats) => stats.completedTuls >= 10,
    rarity: 'rare',
    reward: {
      title: 'Maestro',
      description: 'Dominas las formas con maestría'
    }
  },
  {
    id: 'tul_legend',
    title: 'Leyenda de las Formas',
    description: 'Completa todos los tuls disponibles',
    icon: '⭐',
    type: 'tul_completion',
    condition: (stats) => stats.completedTuls >= stats.totalTuls,
    rarity: 'legendary',
    reward: {
      title: 'Leyenda',
      description: 'Eres una leyenda viva de las formas de Taekwondo'
    }
  },

  // Theory Study Achievements
  {
    id: 'theory_beginner',
    title: 'Estudiante de Teoría',
    description: 'Completa tu primera sesión de teoría',
    icon: '📚',
    type: 'theory_study',
    condition: (stats) => stats.studiedTheorySessions >= 1,
    rarity: 'common',
    reward: {
      title: 'Estudiante',
      description: 'El conocimiento es el camino hacia la maestría'
    }
  },
  {
    id: 'vocabulary_master',
    title: 'Maestro del Vocabulario',
    description: 'Estudia vocabulario coreano 10 veces',
    icon: '🇰🇷',
    type: 'theory_study',
    condition: (stats) => stats.studiedTheorySessions >= 10,
    rarity: 'rare',
    reward: {
      title: 'Lingüista',
      description: 'Hablas el idioma del Taekwondo'
    }
  },

  // Exam Achievements
  {
    id: 'first_exam',
    title: 'Primer Examen',
    description: 'Aprueba tu primer examen de cinturón',
    icon: '🎯',
    type: 'exam_passed',
    condition: (stats) => stats.completedExams >= 1,
    rarity: 'common',
    reward: {
      title: 'Examinado',
      description: 'Has superado tu primera prueba'
    }
  },
  {
    id: 'exam_warrior',
    title: 'Guerrero de Exámenes',
    description: 'Aprueba 5 exámenes',
    icon: '⚔️',
    type: 'exam_passed',
    condition: (stats) => stats.completedExams >= 5,
    rarity: 'rare',
    reward: {
      title: 'Guerrero',
      description: 'Cada examen superado te hace más fuerte'
    }
  },

  // Streak Achievements
  {
    id: 'consistent_practitioner',
    title: 'Practicante Consistente',
    description: 'Mantén una racha de 7 días practicando',
    icon: '🔥',
    type: 'streak',
    condition: (stats) => stats.currentStreak >= 7,
    rarity: 'rare',
    reward: {
      title: 'Consistente',
      description: 'La constancia es la llave del éxito'
    }
  },
  {
    id: 'dedication_master',
    title: 'Maestro de la Dedicación',
    description: 'Mantén una racha de 30 días practicando',
    icon: '💎',
    type: 'streak',
    condition: (stats) => stats.longestStreak >= 30,
    rarity: 'epic',
    reward: {
      title: 'Dedicado',
      description: 'Tu dedicación es legendaria'
    }
  },

  // Dedication Achievements
  {
    id: 'time_warrior',
    title: 'Guerrero del Tiempo',
    description: 'Practica durante 10 horas en total',
    icon: '⏰',
    type: 'dedication',
    condition: (stats) => stats.totalPracticeTime >= 600, // 10 hours in minutes
    rarity: 'rare',
    reward: {
      title: 'Guerrero del Tiempo',
      description: 'Cada minuto cuenta hacia la maestría'
    }
  },
  {
    id: 'eternal_student',
    title: 'Estudiante Eterno',
    description: 'Practica durante 50 horas en total',
    icon: '🌟',
    type: 'dedication',
    condition: (stats) => stats.totalPracticeTime >= 3000, // 50 hours in minutes
    rarity: 'legendary',
    reward: {
      title: 'Eterno',
      description: 'El aprendizaje nunca termina'
    }
  }
];

export const getAchievementStats = (
  completedTuls: number,
  totalTuls: number,
  completedExams: number,
  totalExams: number,
  studiedTheorySessions: number,
  currentStreak: number,
  longestStreak: number,
  totalPracticeTime: number,
  joinedDate: Date
): AchievementStats => ({
  completedTuls,
  totalTuls,
  completedExams,
  totalExams,
  studiedTheorySessions,
  currentStreak,
  longestStreak,
  totalPracticeTime,
  joinedDate
});

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 bg-gray-100';
    case 'rare':
      return 'text-blue-600 bg-blue-100';
    case 'epic':
      return 'text-purple-600 bg-purple-100';
    case 'legendary':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getRarityLabel = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'Común';
    case 'rare':
      return 'Raro';
    case 'epic':
      return 'Épico';
    case 'legendary':
      return 'Legendario';
    default:
      return 'Común';
  }
};