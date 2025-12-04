// TechnologyForm.jsx - переработанный под Material UI
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications.jsx'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    IconButton,
    Stack,
    Chip,
    Alert,
    Grid,
    Divider
} from '@mui/material'
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Save,
    Cancel,
    Delete,
    Link as LinkIcon,
    CalendarToday,
    Category,
    School,
    TrendingUp
} from '@mui/icons-material'

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
    const navigate = useNavigate()
    const { addNotification } = useNotifications()

    const [formData, setFormData] = useState({
        id: initialData.id || Date.now().toString(),
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'frontend',
        difficulty: initialData.difficulty || 'beginner',
        status: initialData.status || 'not-started',
        deadline: initialData.deadline || '',
        resources: initialData.resources || [''],
        notes: initialData.notes || '',
        createdAt: initialData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })

    const [errors, setErrors] = useState({})
    const [isFormValid, setIsFormValid] = useState(false)
    const [touched, setTouched] = useState({})

    const validateForm = () => {
        const newErrors = {}

        // Валидация названия
        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно'
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа'
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов'
        }

        // Валидация описания
        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно'
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов'
        }

        // Валидация дедлайна
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом'
            }
        }

        // Валидация URL-адресов ресурсов
        formData.resources.forEach((resource, index) => {
            if (resource && !isValidUrl(resource)) {
                newErrors[`resource_${index}`] = 'Введите корректный URL'
            }
        })

        setErrors(newErrors)
        setIsFormValid(Object.keys(newErrors).length === 0)
    }

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    useEffect(() => {
        validateForm()
    }, [formData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            updatedAt: new Date().toISOString()
        }))
        setTouched(prev => ({ ...prev, [name]: true }))
    }

    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources]
        newResources[index] = value
        setFormData(prev => ({
            ...prev,
            resources: newResources,
            updatedAt: new Date().toISOString()
        }))
        setTouched(prev => ({ ...prev, [`resource_${index}`]: true }))
    }

    const addResourceField = () => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, ''],
            updatedAt: new Date().toISOString()
        }))
    }

    const removeResourceField = (index) => {
        if (formData.resources.length > 1) {
            const newResources = formData.resources.filter((_, i) => i !== index)
            setFormData(prev => ({
                ...prev,
                resources: newResources,
                updatedAt: new Date().toISOString()
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setTouched({
            title: true,
            description: true,
            ...Object.fromEntries(formData.resources.map((_, i) => [`resource_${i}`, true]))
        })

        if (isFormValid) {
            const cleanedData = {
                ...formData,
                resources: formData.resources.filter(resource => resource.trim() !== ''),
                updatedAt: new Date().toISOString()
            }

            // Сохраняем в localStorage
            saveTechnologyToLocalStorage(cleanedData)
            addNotification(`Технология "${formData.title}" успешно сохранена!`, 'success')
            navigate('/')
        } else {
            addNotification('Пожалуйста, исправьте ошибки в форме', 'error')
        }
    }

    const saveTechnologyToLocalStorage = (technologyData) => {
        try {
            const existingTechnologies = JSON.parse(localStorage.getItem('technologies') || '[]')

            if (initialData.id) {
                // Редактирование существующей технологии
                const updatedTechnologies = existingTechnologies.map(tech =>
                    tech.id === initialData.id ? technologyData : tech
                )
                localStorage.setItem('technologies', JSON.stringify(updatedTechnologies))
            } else {
                // Добавление новой технологии
                const newTechnology = {
                    ...technologyData,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                }
                const updatedTechnologies = [...existingTechnologies, newTechnology]
                localStorage.setItem('technologies', JSON.stringify(updatedTechnologies))
            }
        } catch (error) {
            console.error('Ошибка при сохранении технологии:', error)
            addNotification('Ошибка при сохранении технологии', 'error')
        }
    }

    const handleTestNotification = () => {
        addNotification('Тестовое уведомление!', 'success')
    }

    const handleFieldBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }))
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                {/* Заголовок */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        Заполните форму для {initialData.title ? 'редактирования' : 'добавления'} технологии
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        {/* Основная информация */}
                        <Grid item xs={12} md={8}>
                            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingUp sx={{ mr: 1 }} />
                                    Основная информация
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Название технологии *"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    onBlur={() => handleFieldBlur('title')}
                                    error={touched.title && !!errors.title}
                                    helperText={touched.title && errors.title}
                                    placeholder="Например: React, Node.js, TypeScript"
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Описание *"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={() => handleFieldBlur('description')}
                                    error={touched.description && !!errors.description}
                                    helperText={touched.description && errors.description}
                                    placeholder="Опишите, что это за технология и зачем её изучать..."
                                    multiline
                                    rows={4}
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Заметки"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Дополнительные заметки о технологии..."
                                    multiline
                                    rows={3}
                                    margin="normal"
                                />
                            </Paper>
                        </Grid>

                        {/* Классификация и настройки */}
                        <Grid item xs={12} md={4}>
                            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Category sx={{ mr: 1 }} />
                                    Классификация
                                </Typography>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Категория</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        label="Категория"
                                    >
                                        <MenuItem value="frontend">Frontend</MenuItem>
                                        <MenuItem value="backend">Backend</MenuItem>
                                        <MenuItem value="database">База данных</MenuItem>
                                        <MenuItem value="devops">DevOps</MenuItem>
                                        <MenuItem value="mobile">Мобильная разработка</MenuItem>
                                        <MenuItem value="other">Другое</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Сложность</InputLabel>
                                    <Select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        label="Сложность"
                                    >
                                        <MenuItem value="beginner">Начальный</MenuItem>
                                        <MenuItem value="intermediate">Средний</MenuItem>
                                        <MenuItem value="advanced">Продвинутый</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Дедлайн"
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    onBlur={() => handleFieldBlur('deadline')}
                                    error={touched.deadline && !!errors.deadline}
                                    helperText={touched.deadline && errors.deadline}
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                />
                            </Paper>
                        </Grid>

                        {/* Ресурсы для изучения */}
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <School sx={{ mr: 1 }} />
                                    Ресурсы для изучения
                                </Typography>

                                {formData.resources.map((resource, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Stack direction="row" spacing={1} alignItems="flex-start">
                                            <TextField
                                                fullWidth
                                                label={`Ресурс ${index + 1}`}
                                                value={resource}
                                                onChange={(e) => handleResourceChange(index, e.target.value)}
                                                onBlur={() => handleFieldBlur(`resource_${index}`)}
                                                error={touched[`resource_${index}`] && !!errors[`resource_${index}`]}
                                                helperText={touched[`resource_${index}`] && errors[`resource_${index}`]}
                                                placeholder="https://example.com"
                                                type="url"
                                                InputProps={{
                                                    startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />
                                                }}
                                            />
                                            {formData.resources.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeResourceField(index)}
                                                    color="error"
                                                    sx={{ mt: 1 }}
                                                    aria-label={`Удалить ресурс ${index + 1}`}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </Box>
                                ))}

                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={addResourceField}
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                >
                                    Добавить ресурс
                                </Button>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Добавьте ссылки на полезные материалы, документацию или курсы
                                </Alert>
                            </Paper>
                        </Grid>

                        {/* Статус валидации */}
                        {!isFormValid && Object.keys(touched).length > 0 && (
                            <Grid item xs={12}>
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">
                                        Исправьте следующие ошибки:
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {Object.entries(errors).map(([field, error]) => (
                                            <li key={field}>
                                                {field === 'title' && 'Название: '}
                                                {field === 'description' && 'Описание: '}
                                                {field === 'deadline' && 'Дедлайн: '}
                                                {field.startsWith('resource_') && `Ресурс ${field.split('_')[1]}: `}
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </Alert>
                            </Grid>
                        )}

                        {/* Кнопки действий */}
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save />}
                                        disabled={!isFormValid}
                                        size="large"
                                    >
                                        {initialData.title ? 'Обновить технологию' : 'Добавить технологию'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={onCancel}
                                        size="large"
                                    >
                                        Отмена
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default TechnologyForm