import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useTechnologies from '../hooks/useTechnologies'
import TechnologyCard from '../components/TechnologyCard'
import WeatherWidget from '../components/WeatherWidget'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Alert
} from '@mui/material'
import {
    Search,
    FilterList,
    Add,
    CheckCircle,
    Refresh,
    Clear,
    TrendingUp
} from '@mui/icons-material'

function TechnologyList() {
    const {
        technologies,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAllStatuses,
    } = useTechnologies()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const navigate = useNavigate()

    const filteredTechnologies = technologies.filter(tech => {
        const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || tech.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
    })

    const categories = [...new Set(technologies.map(tech => tech.category).filter(Boolean))]

    const completedCount = technologies.filter(t => t.status === 'completed').length
    const inProgressCount = technologies.filter(t => t.status === 'in-progress').length
    const notStartedCount = technologies.filter(t => t.status === 'not-started').length
    const progress = technologies.length > 0 ? Math.round((completedCount / technologies.length) * 100) : 0

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Все технологии
                    </Typography>
                    <Typography color="text.secondary">
                        Всего: {technologies.length} | Найдено: {filteredTechnologies.length}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('./add-technology')}
                >
                    Добавить технологию
                </Button>
            </Box>

            {/* Weather Widget */}
            <Box sx={{ mb: 3 }}>
                <WeatherWidget />
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom variant="overline">
                                Всего технологий
                            </Typography>
                            <Typography variant="h4">
                                {technologies.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="success.main" gutterBottom variant="overline">
                                Завершено
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {completedCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="warning.main" gutterBottom variant="overline">
                                В процессе
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {inProgressCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom variant="overline">
                                Прогресс
                            </Typography>
                            <Typography variant="h4">
                                {progress}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Фильтры и поиск
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Поиск по названию, описанию или заметкам..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                                            <Clear />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Статус</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Статус"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">Все статусы</MenuItem>
                                <MenuItem value="not-started">Не начато</MenuItem>
                                <MenuItem value="in-progress">В процессе</MenuItem>
                                <MenuItem value="completed">Завершено</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Категория</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Категория"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <MenuItem value="all">Все категории</MenuItem>
                                {categories.map(category => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSearchQuery('')
                            setStatusFilter('all')
                            setCategoryFilter('all')
                        }}
                        startIcon={<Clear />}
                    >
                        Сбросить фильтры
                    </Button>
                </Stack>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
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
            </Paper>

            {/* Technologies Grid */}
            {filteredTechnologies.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredTechnologies.map(tech => (
                        <Grid item xs={12} sm={6} md={4} key={tech.id}>
                            <TechnologyCard
                                technology={tech}
                                onStatusChange={updateStatus}
                                onNotesChange={updateNotes}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom color="text.secondary">
                        Технологий не найдено
                    </Typography>
                    <Typography paragraph color="text.secondary">
                        {technologies.length === 0
                            ? 'У вас еще нет технологий. Добавьте первую!'
                            : 'Попробуйте изменить параметры поиска или фильтры'}
                    </Typography>
                    {technologies.length === 0 && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/add-technology')}
                        >
                            Добавить первую технологию
                        </Button>
                    )}
                </Paper>
            )}
        </Container>
    )
}

export default TechnologyList