import { useState, useCallback } from 'react';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    console.log('useNotifications:', { notifications, count: notifications.length });

    const addNotification = useCallback((message, severity = 'info') => {
        console.log('addNotification вызван:', { message, severity });

        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            message,
            severity,
            timestamp: new Date()
        };

        console.log('Создано новое уведомление:', newNotification);

        setNotifications(prev => {
            const updated = [...prev, newNotification];
            console.log('Обновленный список уведомлений:', updated);
            return updated;
        });

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        console.log('removeNotification вызван для id:', id);
        setNotifications(prev => {
            const updated = prev.filter(notification => notification.id !== id);
            console.log('После удаления:', updated);
            return updated;
        });
    }, []);

    const clearAllNotifications = useCallback(() => {
        console.log('clearAllNotifications вызван');
        setNotifications([]);
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
    };
};