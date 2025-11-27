import { useState, useCallback } from 'react';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, severity = 'info') => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            message,
            severity,
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, newNotification]);
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
    };
};