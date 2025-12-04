import React, { useState } from 'react'
import useTechnologies from '../hooks/useTechnologies'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    Alert,
    LinearProgress,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material'
import {
    CloudUpload,
    CloudDownload,
    CheckCircle,
    Refresh,
    Delete,
    Add,
    DataArray,
    Warning
} from '@mui/icons-material'

function DataImportExport() {
    const { technologies, markAllCompleted, resetAllStatuses } = useTechnologies()
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isDragging, setIsDragging] = useState(false)

    const exportToJSON = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            setStatus({ type: 'success', message: 'Данные экспортированы в JSON' })
            setTimeout(() => setStatus({ type: '', message: '' }), 3000)
        } catch (error) {
            setStatus({ type: 'error', message: 'Ошибка экспорта данных' })
            console.error('Ошибка экспорта:', error)
        }
    }

    const importFromJSON = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result)

                if (!Array.isArray(imported)) {
                    throw new Error('Неверный формат данных')
                }

                localStorage.setItem('technologies', JSON.stringify(imported))
                setStatus({ type: 'success', message: `Импортировано ${imported.length} технологий` })
                setTimeout(() => {
                    setStatus({ type: '', message: '' })
                    window.location.reload()
                }, 3000)
            } catch (error) {
                setStatus({ type: 'error', message: 'Ошибка импорта: неверный формат файла' })
            }
        }
        reader.readAsText(file)
        event.target.value = ''
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type === 'application/json') {
            importFromJSON({ target: { files: [file] } })
        }
    }

    const handleClearAll = () => {
        if (window.confirm('Вы уверены, что хотите удалить все технологии? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies')
            setStatus({ type: 'success', message: 'Все данные удалены' })
            setTimeout(() => {
                setStatus({ type: '', message: '' })
                window.location.reload()
            }, 3000)
        }
    }

    const generateSampleData = () => {
        const sampleData = [
            {
                id: Date.now(),
                title: 'React Hooks',
                description: 'Изучение современных хуков React',
                status: 'not-started',
                category: 'frontend',
                difficulty: 'intermediate',
                resources: ['https://react.dev/reference/react'],
                notes: '',
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                title: 'Express.js',
                description: 'Фреймворк для создания веб-приложений на Node.js',
                status: 'in-progress',
                category: 'backend',
                difficulty: 'beginner',
                resources: ['https://expressjs.com'],
                notes: '',
                createdAt: new Date().toISOString()
            }
        ]

        localStorage.setItem('technologies', JSON.stringify(sampleData))
        setStatus({ type: 'success', message: 'Демо данные добавлены' })
        setTimeout(() => {
            setStatus({ type: '', message: '' })
            window.location.reload()
        }, 3000)
    }

    const completedCount = technologies.filter(t => t.status === 'completed').length
    const inProgressCount = technologies.filter(t => t.status === 'in-progress').length
    const notStartedCount = technologies.filter(t => t.status === 'not-started').length
    const progress = technologies.length > 0 ? Math.round((completedCount / technologies.length) * 100) : 0

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Импорт и экспорт данных
            </Typography>

            {status.message && (
                <Alert
                    severity={status.type === 'error' ? 'error' : 'success'}
                    sx={{ mb: 3 }}
                    onClose={() => setStatus({ type: '', message: '' })}
                >
                    {status.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Экспорт данных */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CloudDownload sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Экспорт данных</Typography>
                            </Box>
                            <Typography color="text.secondary" paragraph>
                                Скачайте ваши данные в формате JSON для резервного копирования.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<CloudDownload />}
                                onClick={exportToJSON}
                                disabled={technologies.length === 0}
                                fullWidth
                            >
                                Экспорт в JSON
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Импорт данных */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CloudUpload sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Импорт данных</Typography>
                            </Box>
                            <Typography color="text.secondary" paragraph>
                                Загрузите ранее экспортированные данные из JSON файла.
                            </Typography>

                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Выбрать JSON файл
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={importFromJSON}
                                    hidden
                                />
                            </Button>

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                                    backgroundColor: isDragging ? 'action.hover' : 'transparent',
                                    cursor: 'pointer'
                                }}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.querySelector('input[type="file"]')?.click()}
                            >
                                <CloudUpload sx={{ fontSize: 40, color: 'action.active', mb: 1 }} />
                                <Typography>
                                    Перетащите JSON-файл сюда или кликните для выбора
                                </Typography>
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Быстрые действия */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Быстрые действия
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        startIcon={<CheckCircle />}
                                        onClick={markAllCompleted}
                                        fullWidth
                                    >
                                        Все выполненные
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<Refresh />}
                                        onClick={resetAllStatuses}
                                        fullWidth
                                    >
                                        Сбросить статусы
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        startIcon={<Add />}
                                        onClick={generateSampleData}
                                        fullWidth
                                    >
                                        Добавить демо
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={handleClearAll}
                                        fullWidth
                                    >
                                        Удалить все
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Статистика */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Текущие данные
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Статистика
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box textAlign="center">
                                                    <Typography variant="h4">
                                                        {technologies.length}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Всего технологий
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box textAlign="center">
                                                    <Typography variant="h4" color="success.main">
                                                        {completedCount}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Завершено
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box textAlign="center">
                                                    <Typography variant="h4" color="warning.main">
                                                        {inProgressCount}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        В процессе
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box textAlign="center">
                                                    <Typography variant="h4" color="text.secondary">
                                                        {notStartedCount}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Не начато
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Общий прогресс
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h3" sx={{ mr: 2 }}>
                                                {progress}%
                                            </Typography>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progress}
                                                    sx={{ height: 10, borderRadius: 5 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {completedCount} из {technologies.length} технологий изучено
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {technologies.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Предпросмотр технологий
                                    </Typography>
                                    <List dense>
                                        {technologies.slice(0, 5).map(tech => (
                                            <ListItem key={tech.id}>
                                                <ListItemText
                                                    primary={tech.title}
                                                    secondary={
                                                        <Chip
                                                            label={tech.status === 'completed' ? 'Завершено' :
                                                                tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                                            size="small"
                                                            color={
                                                                tech.status === 'completed' ? 'success' :
                                                                    tech.status === 'in-progress' ? 'warning' : 'default'
                                                            }
                                                        />
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                        {technologies.length > 5 && (
                                            <ListItem>
                                                <ListItemText
                                                    secondary={`... и еще ${technologies.length - 5} технологий`}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default DataImportExport