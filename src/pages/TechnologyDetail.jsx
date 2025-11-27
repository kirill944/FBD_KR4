import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import useTechnologies from '../hooks/useTechnologies'

function TechnologyDetail() {
    const { techId } = useParams()
    const navigate = useNavigate()
    const { technologies, updateStatus, updateTechnology, deleteTechnology } = useTechnologies()
    const [technology, setTechnology] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({})

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

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            deleteTechnology(parseInt(techId))
            navigate('/technologies')
        }
    }

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="btn btn-secondary">
                    ← Назад к списку
                </Link>
                <div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn btn-primary"
                        style={{ marginRight: '10px' }}
                    >
                        {isEditing ? 'Отменить' : 'Редактировать'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-danger"
                    >
                        Удалить
                    </button>
                </div>
            </div>

            {!isEditing ? (
                <div className="technology-detail">
                    <div className="detail-header">
                        <h1>{technology.title}</h1>
                        <span className={`status status-${technology.status}`}>
              {technology.status === 'completed' ? '✅ Завершено' :
                  technology.status === 'in-progress' ? '🟡 В процессе' : '⭕ Не начато'}
            </span>
                    </div>

                    <div className="detail-section">
                        <h3>Описание</h3>
                        <p>{technology.description}</p>
                    </div>

                    <div className="detail-meta">
                        {technology.category && (
                            <div className="meta-item">
                                <strong>Категория:</strong> {technology.category}
                            </div>
                        )}
                        {technology.difficulty && (
                            <div className="meta-item">
                                <strong>Сложность:</strong> {technology.difficulty}
                            </div>
                        )}
                        {technology.deadline && (
                            <div className="meta-item">
                                <strong>Дедлайн:</strong> {new Date(technology.deadline).toLocaleDateString()}
                            </div>
                        )}
                        {technology.createdAt && (
                            <div className="meta-item">
                                <strong>Добавлено:</strong> {new Date(technology.createdAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {technology.notes && (
                        <div className="detail-section">
                            <h3>Мои заметки</h3>
                            <div className="notes-content">
                                {technology.notes}
                            </div>
                        </div>
                    )}

                    {technology.resources && technology.resources.length > 0 && (
                        <div className="detail-section">
                            <h3>Ресурсы для изучения</h3>
                            <ul className="resources-list">
                                {technology.resources.map((resource, index) => (
                                    <li key={index}>
                                        <a href={resource} target="_blank" rel="noopener noreferrer">
                                            {resource}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="detail-section">
                        <h3>Статус изучения</h3>
                        <div className="status-buttons">
                            <button
                                onClick={() => handleStatusChange('not-started')}
                                className={`btn ${technology.status === 'not-started' ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                ⭕ Не начато
                            </button>
                            <button
                                onClick={() => handleStatusChange('in-progress')}
                                className={`btn ${technology.status === 'in-progress' ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                🟡 В процессе
                            </button>
                            <button
                                onClick={() => handleStatusChange('completed')}
                                className={`btn ${technology.status === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                ✅ Завершено
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="edit-form">
                    <h2>Редактирование технологии</h2>
                    <div className="form-group">
                        <label>Название</label>
                        <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <label>Категория</label>
                        <select
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">База данных</option>
                            <option value="devops">DevOps</option>
                            <option value="mobile">Мобильная разработка</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Заметки</label>
                        <textarea
                            value={editForm.notes || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                            rows="3"
                        />
                    </div>
                    <div className="form-actions">
                        <button onClick={handleSave} className="btn btn-primary">
                            Сохранить
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TechnologyDetail