import { useState, useEffect } from 'react';
import { fetchJson } from './api';

export function useUnreadUrgentAnnouncements() {
  const [hasUnreadUrgent, setHasUnreadUrgent] = useState(false);

  useEffect(() => {
    const checkUnreadUrgent = async () => {
      try {
        const announcements = await fetchJson('announcements.json');
        const read = JSON.parse(localStorage.getItem('read_announcements') || '[]');
        
        const hasUnread = announcements.some(announcement => 
          announcement.type === 'urgent' && !read.includes(announcement.id)
        );
        
        setHasUnreadUrgent(hasUnread);
      } catch (error) {
        console.error('Error checking unread urgent announcements:', error);
      }
    };

    checkUnreadUrgent();
    
    // Проверяем при изменении localStorage
    const handleStorageChange = () => {
      checkUnreadUrgent();
    };
    
    // Слушаем изменения из других окон
    window.addEventListener('storage', handleStorageChange);
    
    // Слушаем кастомное событие для изменений в том же окне
    window.addEventListener('announcementsRead', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('announcementsRead', handleStorageChange);
    };
  }, []);

  return hasUnreadUrgent;
} 