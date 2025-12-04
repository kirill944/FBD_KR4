import React, { useState } from 'react'
import useTechnologies from '../hooks/useTechnologies'
import {
    Container,
    Typography,
    Box,
    Paper,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material'
import {
    TrendingUp,
    CheckCircle,
    PlayCircle,
    Pending,
    Category,
    Timeline
} from '@mui/icons-material'

function Statistics() {
    const { getStats } = useTechnologies()
    const [timeRange, setTimeRange] = useState('all')

    const stats = getStats()

    const getCategoryProgress = (categoryStats) => {
        return Object.entries(categoryStats).map(([category, data]) => ({
            category,
            progress: Math.round((data.completed / data.total) * 100),
            ...data
        })).sort((a, b) => b.progress - a.progress)
    }

    const categoryProgress = getCategoryProgress(stats.categoryStats)

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Статистика изучения
            </Typography>

            {/* Time Range Filter */}
            <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Период</InputLabel>
                    <Select
                        value={timeRange}
                        label="Период"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="all">За все время</MenuItem>
                        <MenuItem value="week">За неделю</MenuItem>
                        <MenuItem value="month">За месяц</MenuItem>
                        <MenuItem value="year">За год</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Main Progress Card */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mr: 2 }} />
                                <Box>
                                    <Typography variant="h2" color="primary">
                                        {stats.progress}%
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        Общий прогресс
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={stats.progress}
                                    sx={{ height: 20, borderRadius: 10, mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {stats.completed} из {stats.total} технологий изучено
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2">
                                {stats.total}
                            </Typography>
                            <Typography color="text.secondary">
                                Всего технологий
                            </Typography>
                            <Chip
                                label="Общее количество"
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" color="success.main">
                                {stats.completed}
                            </Typography>
                            <Typography color="text.secondary">
                                Завершено
                            </Typography>
                            <Chip
                                icon={<CheckCircle />}
                                label="Изучено"
                                size="small"
                                color="success"
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" color="warning.main">
                                {stats.inProgress}
                            </Typography>
                            <Typography color="text.secondary">
                                В процессе
                            </Typography>
                            <Chip
                                icon={<PlayCircle />}
                                label="В работе"
                                size="small"
                                color="warning"
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" color="text.secondary">
                                {stats.notStarted}
                            </Typography>
                            <Typography color="text.secondary">
                                Не начато
                            </Typography>
                            <Chip
                                icon={<Pending />}
                                label="Ожидает"
                                size="small"
                                variant="outlined"
                                    sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Category Progress */}
            {categoryProgress.length > 0 && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Прогресс по категориям
                        </Typography>

                        <Grid container spacing={3}>
                            {categoryProgress.map((category, index) => (
                                <Grid item xs={12} md={6} key={category.category}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle1">
                                                {category.category}
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {category.progress}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={category.progress}
                                            sx={{ height: 10, borderRadius: 5, mb: 1 }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.completed} из {category.total} изучено
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.inProgress} в процессе
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Detailed Stats */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Распределение по статусам
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant="body2">Завершено</Typography>
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(stats.completed / stats.total) * 100}
                                        color="success"
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
                                    {Math.round((stats.completed / stats.total) * 100)}%
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant="body2">В процессе</Typography>
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(stats.inProgress / stats.total) * 100}
                                        color="warning"
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
                                    {Math.round((stats.inProgress / stats.total) * 100)}%
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant="body2">Не начато</Typography>
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(stats.notStarted / stats.total) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
                                    {Math.round((stats.notStarted / stats.total) * 100)}%
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Сводка по статусам
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            borderColor: 'success.main',
                                            backgroundColor: 'success.50'
                                        }}
                                    >
                                        <Typography variant="h4" color="success.main">
                                            {stats.completed}
                                        </Typography>
                                        <Typography variant="body2" color="success.main">
                                            Завершено
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            borderColor: 'warning.main',
                                            backgroundColor: 'warning.50'
                                        }}
                                    >
                                        <Typography variant="h4" color="warning.main">
                                            {stats.inProgress}
                                        </Typography>
                                        <Typography variant="body2" color="warning.main">
                                            В процессе
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            borderColor: 'text.secondary',
                                            backgroundColor: 'action.hover'
                                        }}
                                    >
                                        <Typography variant="h4">
                                            {stats.notStarted}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Не начато
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            borderColor: 'primary.main',
                                            backgroundColor: 'primary.50'
                                        }}
                                    >
                                        <Typography variant="h4" color="primary.main">
                                            {stats.progress}%
                                        </Typography>
                                        <Typography variant="body2" color="primary.main">
                                            Прогресс
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Statistics