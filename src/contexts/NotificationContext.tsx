import React, { createContext, useContext, useState, useCallback } from 'react';

export interface IntelAlert {
  id: string;
  title: string;
  message: string;
  type: 'tactical' | 'grid' | 'mission';
  timestamp: string;
  isRead: boolean;
}

interface NotificationContextType {
  alerts: IntelAlert[];
  hasUnread: boolean;
  addAlert: (title: string, message: string, type: IntelAlert['type']) => void;
  markAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<IntelAlert[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const addAlert = useCallback((title: string, message: string, type: IntelAlert['type']) => {
    const newAlert: IntelAlert = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      isRead: false
    };
    setAlerts(prev => [newAlert, ...prev]);
    setHasUnread(true);
  }, []);

  const markAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    setHasUnread(false);
  };

  return (
    <NotificationContext.Provider value={{ alerts, hasUnread, addAlert, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useIntel = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useIntel must be used within NotificationProvider");
  return context;
};