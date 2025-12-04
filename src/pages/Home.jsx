import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    LinearProgress,
    Chip,
    Stack,
    Divider
} from '@mui/material'
import {
    Add,
    TrendingUp,
    CheckCircle,
    PlayCircle,
    Pending,
    School
} from '@mui/icons-material'

function Home() {
    const {
        technologies,
        markAllCompleted,
        resetAllStatuses,
        getStats
    } = useTechnologies()
    const navigate = useNavigate()

    const stats = getStats()
    const recentTechnologies = technologies.slice(0, 3)

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Добро пожаловать в Трекер технологий
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Отслеживайте ваш прогресс в изучении новых технологий
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => navigate('./add-technology')}
                >
                    Добавить технологию
                </Button>
            </Box>

            {/* Main Progress */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h5">
                                Общий прогресс
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {stats.progress}%
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={stats.progress}
                                sx={{ height: 12, borderRadius: 6 }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {stats.completed} из {stats.total} технологий
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" color="primary">
                                {stats.total}
                            </Typography>
                            <Typography color="text.secondary">
                                Всего технологий
                            </Typography>
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
                                Изучено
                            </Typography>
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
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2">
                                {stats.progress}%
                            </Typography>
                            <Typography color="text.secondary">
                                Прогресс
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Technologies */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">
                            <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Недавние технологии
                        </Typography>
                        {technologies.length > 0 && (
                            <Button
                                variant="text"
                                onClick={() => navigate('/technologies')}
                            >
                                Посмотреть все →
                            </Button>
                        )}
                    </Box>

                    {recentTechnologies.length > 0 ? (
                        <Grid container spacing={3}>
                            {recentTechnologies.map(tech => (
                                <Grid item xs={12} md={4} key={tech.id}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                        onClick={() => navigate(`/technology/${tech.id}`)}
                                    >
                                        <Typography variant="h6" gutterBottom noWrap>
                                            {tech.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {tech.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Chip
                                                label={tech.status === 'completed' ? 'Завершено' :
                                                    tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                                size="small"
                                                color={
                                                    tech.status === 'completed' ? 'success' :
                                                        tech.status === 'in-progress' ? 'warning' : 'default'
                                                }
                                            />
                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                sx={{ fontWeight: 500 }}
                                            >
                                                Подробнее →
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom color="text.secondary">
                                Технологий пока нет
                            </Typography>
                            <Typography paragraph color="text.secondary">
                                Добавьте первую технологию для отслеживания прогресса
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => navigate('./add-technology')}
                            >
                                Добавить технологию
                            </Button>
                        </Paper>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Быстрые действия
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        <Button
                            variant="outlined"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={markAllCompleted}
                        >
                            Отметить все как выполненные
                        </Button>
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<Refresh />}
                            onClick={resetAllStatuses}
                        >
                            Сбросить все статусы
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}

export default Home