import React, { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useTheme } from '../hooks/useTheme'
import { useNotifications } from '../hooks/useNotifications.jsx'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    MenuItem,
    Alert,
    Grid,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Stack
} from '@mui/material'
import {
    Person,
    Palette,
    Notifications,
    Language,
    Delete,
    Backup,
    Restore,
    Info,
    Save,
    Cancel,
    DarkMode,
    LightMode,
    ExpandMore,
    Settings as SettingsIcon,
    Security,
    Brush,
    DataUsage,
    CloudUpload,
    CloudDownload
} from '@mui/icons-material'

function Settings() {
    const [username, setUsername] = useLocalStorage('username', 'Пользователь')
    const { darkMode, toggleDarkMode } = useTheme()
    const [notifications, setNotifications] = useLocalStorage('notifications', true)
    const [language, setLanguage] = useLocalStorage('language', 'ru')
    const { addNotification } = useNotifications()

    const [newUsername, setNewUsername] = useState(username)
    const [isEditing, setIsEditing] = useState(false)
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [importDialogOpen, setImportDialogOpen] = useState(false)

    const handleResetData = () => {
        setExportDialogOpen(true)
    }

    const handleResetConfirm = () => {
        localStorage.removeItem('technologies')
        localStorage.removeItem('username')
        localStorage.removeItem('darkMode')
        localStorage.removeItem('notifications')
        localStorage.removeItem('language')
        addNotification('Все данные сброшены', 'success')
        setExportDialogOpen(false)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
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
        setImportDialogOpen(false)
    }

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    const handleUsernameChange = () => {
        if (newUsername.trim() === '') {
            addNotification('Имя пользователя не может быть пустым', 'error')
            return
        }

        setUsername(newUsername.trim())
        addNotification('Имя пользователя успешно изменено', 'success')
        reloadPage()
    }

    const handleThemeToggle = () => {
        toggleDarkMode()
        addNotification('Тема изменена', 'info')
        reloadPage()
    }

    const handleStartEditing = () => {
        setNewUsername(username)
        setIsEditing(true)
    }

    const handleCancelEditing = () => {
        setNewUsername(username)
        setIsEditing(false)
    }

    const handleNotificationsChange = (event) => {
        setNotifications(event.target.checked)
        addNotification(
            event.target.checked ? 'Уведомления включены' : 'Уведомления отключены',
            'info'
        )
    }

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage)
        addNotification('Язык изменен', 'success')
        reloadPage()
    }

    const handleImportClick = () => {
        document.getElementById('import-file-input').click()
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SettingsIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" component="h1">
                            Настройки
                        </Typography>
                        <Typography color="text.secondary">
                            Управление параметрами приложения
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Профиль пользователя */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Person sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h5">
                                    Профиль пользователя
                                </Typography>
                            </Box>

                            {!isEditing ? (
                                <Box>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Текущее имя пользователя
                                        </Typography>
                                        <Typography variant="h6">
                                            {username}
                                        </Typography>
                                    </Paper>
                                    <Button
                                        variant="contained"
                                        onClick={handleStartEditing}
                                        startIcon={<Person />}
                                        fullWidth
                                    >
                                        Изменить имя
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    <TextField
                                        label="Новое имя пользователя"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Введите ваше имя"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            onClick={handleUsernameChange}
                                            startIcon={<Save />}
                                            fullWidth
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancelEditing}
                                            startIcon={<Cancel />}
                                            fullWidth
                                        >
                                            Отмена
                                        </Button>
                                    </Stack>
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        Новое имя будет отображаться в навигационной панели
                                    </Alert>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Язык */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Language sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h5">
                                    Язык
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        label="Выберите язык"
                                        value={language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="ru">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ mr: 2 }}>🇷🇺</Box>
                                                Русский
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="en">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ mr: 2 }}>🇺🇸</Box>
                                                English
                                            </Box>
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Текущий язык: {language === 'ru' ? 'Русский' : 'English'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Управление данными */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <DataUsage sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h5">
                                    Управление данными
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <CloudDownload sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Экспорт данных
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Создайте резервную копию всех ваших данных
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Backup />}
                                            onClick={handleExportData}
                                            fullWidth
                                        >
                                            Экспортировать
                                        </Button>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <CloudUpload sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Импорт данных
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Восстановите данные из резервной копии
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="info"
                                            startIcon={<Restore />}
                                            onClick={() => setImportDialogOpen(true)}
                                            fullWidth
                                        >
                                            Импортировать
                                        </Button>
                                        <input
                                            id="import-file-input"
                                            type="file"
                                            accept=".json"
                                            onChange={handleImportData}
                                            style={{ display: 'none' }}
                                        />
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            borderColor: 'error.main'
                                        }}
                                    >
                                        <Delete sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom color="error">
                                            Сброс данных
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Удалите все данные и настройки
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={handleResetData}
                                            fullWidth
                                        >
                                            Сбросить всё
                                        </Button>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Alert severity="warning" sx={{ mt: 3 }}>
                                <Typography variant="subtitle2">
                                    Внимание: Сброс данных нельзя отменить!
                                </Typography>
                                Все ваши технологии и настройки будут удалены без возможности восстановления.
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Информация о приложении */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Info sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h5">
                                    О приложении
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Трекер технологий
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Приложение для отслеживания прогресса в изучении технологий
                                        </Typography>

                                        <List dense>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Версия"
                                                    secondary="1.0.0"
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Диалог сброса данных */}
            <Dialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
            >
                <DialogTitle color="error">
                    <Delete sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Подтверждение сброса данных
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Это действие нельзя отменить!
                    </Alert>
                    <Typography paragraph>
                        Вы уверены, что хотите сбросить все данные?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Будет удалено:
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText primary="Все технологии и прогресс" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Настройки профиля" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Предпочтения темы" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Настройки уведомлений" />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleResetConfirm}
                        color="error"
                        variant="contained"
                        startIcon={<Delete />}
                    >
                        Сбросить всё
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог импорта данных */}
            <Dialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            >
                <DialogTitle>
                    <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Импорт данных
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Выберите файл резервной копии (.json)
                    </Alert>
                    <Typography paragraph>
                        При импорте существующие данные будут заменены.
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        fullWidth
                    >
                        Выбрать файл для импорта
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            hidden
                        />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportDialogOpen(false)}>
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Settings