import React, { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useTheme } from '../hooks/useTheme'
import { useNotifications } from '../hooks/useNotifications.jsx'
import {
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    FormControlLabel,
    MenuItem,
    Alert
} from '@mui/material'

function Settings() {
    const [username, setUsername] = useLocalStorage('username', 'Пользователь')
    const { darkMode, toggleDarkMode } = useTheme()
    const [notifications, setNotifications] = useLocalStorage('notifications', true)
    const [language, setLanguage] = useLocalStorage('language', 'ru')
    const { addNotification } = useNotifications()

    const [newUsername, setNewUsername] = useState(username)
    const [isEditing, setIsEditing] = useState(false)

    const handleResetData = () => {
        if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies')
            localStorage.removeItem('username')
            localStorage.removeItem('darkMode')
            localStorage.removeItem('notifications')
            localStorage.removeItem('language')
            addNotification('Все данные сброшены', 'success')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }

    const handleExportData = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: JSON.parse(localStorage.getItem('technologies') || '[]'),
            settings: {
                username: localStorage.getItem('username'),
                darkMode: localStorage.getItem('darkMode'),
                notifications: localStorage.getItem('notifications'),
                language: localStorage.getItem('language')
            }
        }

        const dataStr = JSON.stringify(data, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `technology_tracker_backup_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        addNotification('Данные успешно экспортированы', 'success')
    }

    const handleImportData = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result)

                if (imported.technologies) {
                    localStorage.setItem('technologies', JSON.stringify(imported.technologies))
                }

                if (imported.settings) {
                    Object.keys(imported.settings).forEach(key => {
                        if (imported.settings[key] !== null) {
                            localStorage.setItem(key, imported.settings[key])
                        }
                    })
                }

                addNotification('Данные успешно импортированы', 'success')
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } catch (error) {
                addNotification('Ошибка импорта: неверный формат файла', 'error')
            }
        }
        reader.readAsText(file)
        event.target.value = ''
    }

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500); // Небольшая задержка для показа уведомления
    };

    const handleUsernameChange = () => {
        if (newUsername.trim() === '') {
            addNotification('Имя пользователя не может быть пустым', 'error')
            return
        }

        setUsername(newUsername.trim())
        addNotification('Имя пользователя успешно изменено', 'success')
        reloadPage() // Вызываем перезагрузку
    }

    const handleThemeToggle = () => {
        toggleDarkMode() // из useTheme
        addNotification('Тема изменена', 'info')
        reloadPage() // Вызываем перезагрузку
    }

    const handleStartEditing = () => {
        setNewUsername(username)
        setIsEditing(true)
    }

    const handleCancelEditing = () => {
        setNewUsername(username)
        setIsEditing(false)
    }

    const handleNotificationsChange = (enabled) => {
        setNotifications(enabled)
        addNotification(
            enabled ? 'Уведомления включены' : 'Уведомления отключены',
            'info'
        )
    }

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage)
        addNotification('Язык изменен', 'success')
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки</h1>
            </div>

            <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
                {/* Профиль пользователя */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Профиль пользователя
                        </Typography>

                        {!isEditing ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body1">
                                    <strong>Текущее имя:</strong> {username}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleStartEditing}
                                    color="primary"
                                >
                                    Изменить имя
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Новое имя пользователя"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="Введите ваше имя"
                                    fullWidth
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleUsernameChange}
                                        color="primary"
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancelEditing}
                                        color="secondary"
                                    >
                                        Отмена
                                    </Button>
                                </Box>
                                <Alert severity="info">
                                    Новое имя будет отображаться в навигационной панели
                                </Alert>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Внешний вид */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Внешний вид
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={handleThemeToggle}
                                    color="primary"
                                />
                            }
                            label={darkMode ? 'Темная тема' : 'Светлая тема'}
                        />
                    </CardContent>
                </Card>

                {/* Язык */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Язык
                        </Typography>
                        <TextField
                            select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="ru">Русский</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                        </TextField>
                    </CardContent>
                </Card>

                {/* Управление данными */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Управление данными
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleResetData}
                                startIcon=""
                                color="error"
                            >
                                Сбросить все данные
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* О приложении */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            О приложении
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography><strong>Трекер технологий</strong></Typography>
                            <Typography>Версия: 1.0.0</Typography>
                            <Typography>Создано для отслеживания прогресса в изучении технологий</Typography>
                            <Typography>Используемые технологии: React, React Router, LocalStorage</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    )
}

export default Settings