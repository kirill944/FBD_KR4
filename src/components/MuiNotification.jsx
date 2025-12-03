import React, { useEffect, useState } from 'react';
import { Alert, Box, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MuiNotification({ notifications, removeNotification }) {
    console.log('MuiNotification рендерится:', {
        notifications,
        count: notifications?.length,
        lastNotification: notifications?.[notifications.length - 1]
    });

    // Если нет уведомлений - не рендерим ничего
    if (!notifications || notifications.length === 0) {
        return null;
    }

    // Берем последнее уведомление
    const lastNotification = notifications[notifications.length - 1];
    const [visible, setVisible] = useState(true);

    // Автоматическое скрытие через 5 секунд
    useEffect(() => {
        if (lastNotification) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => {
                    removeNotification(lastNotification.id);
                }, 300); // Задержка для анимации
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [lastNotification, removeNotification]);

    if (!visible) return null;

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'success': return '#4caf50';
            case 'error': return '#f44336';
            case 'warning': return '#ff9800';
            default: return '#2196f3';
        }
    };

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '500px'
        }}>
            <Fade in={visible}>
                <Box
                    sx={{
                        backgroundColor: getSeverityColor(lastNotification.severity),
                        color: 'white',
                        borderRadius: '8px',
                        padding: '16px 24px',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ flex: 1, paddingRight: '30px' }}>
                        <Box sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            marginBottom: '4px'
                        }}>
                            {lastNotification.severity === 'success' && '✅ '}
                            {lastNotification.severity === 'error' && '❌ '}
                            {lastNotification.severity === 'warning' && '⚠️ '}
                            {lastNotification.severity === 'info' && 'ℹ️ '}
                            {lastNotification.severity?.toUpperCase()}
                        </Box>
                        <Box sx={{ fontSize: '14px' }}>
                            {lastNotification.message}
                        </Box>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={() => {
                            setVisible(false);
                            setTimeout(() => removeNotification(lastNotification.id), 300);
                        }}
                        sx={{
                            color: 'white',
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            padding: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Fade>
        </Box>
    );
}

export default MuiNotification;