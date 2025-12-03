import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications.jsx'
import './TechnologyForm.css'
import { Button } from '@mui/material';

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
    }

    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources]
        newResources[index] = value
        setFormData(prev => ({
            ...prev,
            resources: newResources,
            updatedAt: new Date().toISOString()
        }))
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
        if (isFormValid) {
            const cleanedData = {
                ...formData,
                resources: formData.resources.filter(resource => resource.trim() !== ''),
                updatedAt: new Date().toISOString()
            }

            // Сохраняем в localStorage
            saveTechnologyToLocalStorage(cleanedData)
            addNotification(`Технология "${formData.title}" успешно сохранена!`, 'success');

            // Показываем уведомление
            addNotification(`Технология "${cleanedData.title}" успешно сохранена!`, 'success')

            // Перенаправляем на страницу технологий
            navigate('/FBD_KR4')
        }
    }

    const saveTechnologyToLocalStorage = (technologyData) => {
        try {
            // Получаем существующие технологии из localStorage
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

    const handleClick = () => {
        addNotification('Тестовое уведомление!', 'success');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>{initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}</h1>
            </div>
            <Button variant="contained" onClick={handleClick}>
                Тест уведомления
            </Button>
            <form onSubmit={handleSubmit} className="technology-form" noValidate>
                {/* Поле названия */}
                <div className="form-group">
                    <label htmlFor="title" className="required">
                        Название технологии
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? 'error' : ''}
                        placeholder="Например: React, Node.js, TypeScript"
                        aria-describedby={errors.title ? 'title-error' : undefined}
                        required
                    />
                    {errors.title && (
                        <span id="title-error" className="error-message" role="alert">
                            {errors.title}
                        </span>
                    )}
                </div>

                {/* Поле описания */}
                <div className="form-group">
                    <label htmlFor="description" className="required">
                        Описание
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={errors.description ? 'error' : ''}
                        placeholder="Опишите, что это за технология и зачем её изучать..."
                        aria-describedby={errors.description ? 'description-error' : undefined}
                        required
                    />
                    {errors.description && (
                        <span id="description-error" className="error-message" role="alert">
                            {errors.description}
                        </span>
                    )}
                </div>

                {/* Выбор категории */}
                <div className="form-group">
                    <label htmlFor="category">Категория</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">База данных</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Мобильная разработка</option>
                        <option value="other">Другое</option>
                    </select>
                </div>

                {/* Выбор сложности */}
                <div className="form-group">
                    <label htmlFor="difficulty">Сложность</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                    >
                        <option value="beginner">Начальный</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                    </select>
                </div>

                {/* Дедлайн */}
                <div className="form-group">
                    <label htmlFor="deadline">Дедлайн (необязательно)</label>
                    <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={errors.deadline ? 'error' : ''}
                        aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                    />
                    {errors.deadline && (
                        <span id="deadline-error" className="error-message" role="alert">
                            {errors.deadline}
                        </span>
                    )}
                </div>

                {/* Заметки */}
                <div className="form-group">
                    <label htmlFor="notes">Заметки</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Дополнительные заметки о технологии..."
                    />
                </div>

                {/* Список ресурсов для изучения */}
                <div className="form-group">
                    <label>Ресурсы для изучения</label>
                    {formData.resources.map((resource, index) => (
                        <div key={index} className="resource-field">
                            <input
                                type="url"
                                value={resource}
                                onChange={(e) => handleResourceChange(index, e.target.value)}
                                placeholder="https://example.com"
                                className={errors[`resource_${index}`] ? 'error' : ''}
                                aria-describedby={errors[`resource_${index}`] ? `resource-${index}-error` : undefined}
                            />
                            {formData.resources.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeResourceField(index)}
                                    className="btn-remove"
                                    aria-label={`Удалить ресурс ${index + 1}`}
                                >
                                    Удалить
                                </button>
                            )}
                            {errors[`resource_${index}`] && (
                                <span id={`resource-${index}-error`} className="error-message" role="alert">
                                    {errors[`resource_${index}`]}
                                </span>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addResourceField}
                        className="btn-add-resource"
                    >
                        + Добавить ресурс
                    </button>
                </div>

                {/* Кнопки действий */}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={!isFormValid}
                    >
                        {initialData.title ? 'Обновить' : 'Добавить технологию'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TechnologyForm