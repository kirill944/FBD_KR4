import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTechnologies from '../hooks/useTechnologies'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    CardActions,
    Grid
} from '@mui/material'
import {
    ArrowBack,
    Edit,
    Delete,
    Save,
    Cancel,
    Link as LinkIcon,
    CalendarToday,
    Category,
    School,
    Notes
} from '@mui/icons-material'

function TechnologyDetail() {
    const { techId } = useParams()
    const navigate = useNavigate()
    const { technologies, updateStatus, updateTechnology, deleteTechnology } = useTechnologies()
    const [technology, setTechnology] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({})
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    useEffect(() => {
        const tech = technologies.find(t => t.id === parseInt(techId))
        setTechnology(tech)
        if (tech) {
            setEditForm(tech)
        }
    }, [techId, technologies])

    const handleStatusChange = (newStatus) => {
        updateStatus(parseInt(techId), newStatus)
        setTechnology(prev => prev ? { ...prev, status: newStatus } : null)
    }

    const handleSave = () => {
        updateTechnology(parseInt(techId), editForm)
        setTechnology(editForm)
        setIsEditing(false)
    }

    const handleDeleteConfirm = () => {
        deleteTechnology(parseInt(techId))
        setDeleteDialogOpen(false)
        navigate('/technologies')
    }

    const getStatusChip = (status) => {
        const statusConfig = {
            'completed': { label: 'Завершено', color: 'success', icon: '✅' },
            'in-progress': { label: 'В процессе', color: 'warning', icon: '🔄' },
            'not-started': { label: 'Не начато', color: 'default', icon: '⏳' }
        }
        const config = statusConfig[status] || statusConfig['not-started']
        return (
            <Chip
                label={config.label}
                color={config.color}
                size="medium"
                sx={{ ml: 1 }}
            />
        )
    }

    if (!technology) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Технология не найдена
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        Технология с ID {techId} не существует.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/technologies')}
                    >
                        Назад к списку
                    </Button>
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/technologies')}
                    sx={{ mb: 2 }}
                >
                    Назад к списку
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4" component="h1">
                            {technology.title}
                        </Typography>
                        {getStatusChip(technology.status)}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant={isEditing ? "outlined" : "contained"}
                            startIcon={<Edit />}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Отменить' : 'Редактировать'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Удалить
                        </Button>
                    </Box>
                </Box>
            </Box>

            {!isEditing ? (
                <Grid container spacing={3}>
                    {/* Основная информация */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Описание
                            </Typography>
                            <Typography paragraph>
                                {technology.description}
                            </Typography>
                        </Paper>

                        {technology.notes && (
                            <Paper sx={{ p: 3, mt: 3 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    <Notes sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Мои заметки
                                </Typography>
                                <Typography>
                                    {technology.notes}
                                </Typography>
                            </Paper>
                        )}

                        {technology.resources && technology.resources.length > 0 && (
                            <Paper sx={{ p: 3, mt: 3 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Ресурсы для изучения
                                </Typography>
                                <List>
                                    {technology.resources.map((resource, index) => (
                                        <ListItem
                                            key={index}
                                            component="a"
                                            href={resource}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <LinkIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={resource}
                                                primaryTypographyProps={{
                                                    sx: { color: 'primary.main' }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Grid>

                    {/* Метаданные и действия */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Информация
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Category sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography>
                                    <strong>Категория:</strong> {technology.category}
                                </Typography>
                            </Box>

                            {technology.deadline && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography>
                                        <strong>Дедлайн:</strong> {new Date(technology.deadline).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}

                            {technology.createdAt && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography>
                                        <strong>Добавлено:</strong> {new Date(technology.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom color="primary">
                                Статус изучения
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button
                                    variant={technology.status === 'not-started' ? "contained" : "outlined"}
                                    onClick={() => handleStatusChange('not-started')}
                                    fullWidth
                                >
                                    Не начато
                                </Button>
                                <Button
                                    variant={technology.status === 'in-progress' ? "contained" : "outlined"}
                                    color="warning"
                                    onClick={() => handleStatusChange('in-progress')}
                                    fullWidth
                                >
                                    В процессе
                                </Button>
                                <Button
                                    variant={technology.status === 'completed' ? "contained" : "outlined"}
                                    color="success"
                                    onClick={() => handleStatusChange('completed')}
                                    fullWidth
                                >
                                    Завершено
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Редактирование технологии
                    </Typography>

                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            label="Название"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Описание"
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Категория</InputLabel>
                            <Select
                                value={editForm.category || ''}
                                label="Категория"
                                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            >
                                <MenuItem value="frontend">Frontend</MenuItem>
                                <MenuItem value="backend">Backend</MenuItem>
                                <MenuItem value="database">База данных</MenuItem>
                                <MenuItem value="devops">DevOps</MenuItem>
                                <MenuItem value="mobile">Мобильная разработка</MenuItem>
                                <MenuItem value="other">Другое</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Заметки"
                            value={editForm.notes || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                            >
                                Сохранить
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={() => setIsEditing(false)}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить технологию "{technology.title}"?
                        Это действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default TechnologyDetail