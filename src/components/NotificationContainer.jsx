import React from 'react'
import { useNotifications } from '../hooks/useNotifications.jsx'
import '../App.css'

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotifications()

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'error': return 'notification-error'
            case 'warning': return 'notification-warning'
            case 'success': return 'notification-success'
            default: return 'notification-info'
        }
    }

    if (notifications.length === 0) return null

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`notification ${getSeverityClass(notification.severity)}`}
                >
                    <div className="notification-content">
                        <span className="notification-message">
                            {notification.message}
                        </span>
                        <button
                            className="notification-close"
                            onClick={() => removeNotification(notification.id)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NotificationContainer