import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trophy, Bell, Target, Award } from 'lucide-react';

export type NotificationType = 'achievement' | 'reminder' | 'milestone' | 'motivation' | 'info';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Helper functions for common notifications
export const createAchievementNotification = (achievementTitle: string, onViewAchievement?: () => void) => ({
  type: 'achievement' as const,
  title: '🎉 ¡Nuevo Logro Desbloqueado!',
  message: `Felicidades! Has desbloqueado "${achievementTitle}"`,
  icon: <Trophy className="w-5 h-5" style={{ color: 'var(--warning-color)' }} />,
  action: onViewAchievement ? {
    label: 'Ver Logros',
    onClick: onViewAchievement,
  } : undefined,
});

export const createReminderNotification = (message: string, actionLabel?: string, onAction?: () => void) => ({
  type: 'reminder' as const,
  title: '⏰ Recordatorio',
  message,
  icon: <Bell className="w-5 h-5" style={{ color: 'var(--info-color)' }} />,
  action: onAction ? {
    label: actionLabel || 'Ir ahora',
    onClick: onAction,
  } : undefined,
});

export const createMilestoneNotification = (milestone: string, onViewProgress?: () => void) => ({
  type: 'milestone' as const,
  title: '🎯 ¡Hito Alcanzado!',
  message: milestone,
  icon: <Target className="w-5 h-5" style={{ color: 'var(--success-color)' }} />,
  action: onViewProgress ? {
    label: 'Ver Progreso',
    onClick: onViewProgress,
  } : undefined,
});

export const createMotivationNotification = (message: string) => ({
  type: 'motivation' as const,
  title: '💪 ¡Sigue Adelante!',
  message,
  icon: <Award className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />,
});