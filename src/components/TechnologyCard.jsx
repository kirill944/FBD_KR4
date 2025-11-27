import React, { useState } from 'react'
import './TechnologyCard.css'

function TechnologyCard({ technology, onStatusChange, onNotesChange }) {
    const [showNotes, setShowNotes] = useState(false)
    const [localNotes, setLocalNotes] = useState(technology.notes || '')

    const handleStatusChange = () => {
        const statuses = ['not-started', 'in-progress', 'completed']
        const currentIndex = statuses.indexOf(technology.status)
        const nextIndex = (currentIndex + 1) % statuses.length
        onStatusChange(technology.id, statuses[nextIndex])
    }

    const handleNotesChange = (e) => {
        const newNotes = e.target.value
        setLocalNotes(newNotes)
        onNotesChange(technology.id, newNotes)
    }

    const getStatusText = (status) => {
        const statusMap = {
            'not-started': 'Не начато',
            'in-progress': 'В процессе',
            'completed': 'Завершено'
        }
        return statusMap[status] || status
    }

    const getStatusIcon = (status) => {
        const iconMap = {
            'not-started': '',
            'in-progress': '',
            'completed': ''
        }
        return iconMap[status] || ''
    }

    return (
        <div
            className={`technology-card status-${technology.status}`}
            onClick={handleStatusChange}
        >
            <div className="card-header">
                <h3>{technology.title}</h3>
                <span className="status-indicator">
          {getStatusIcon(technology.status)} {getStatusText(technology.status)}
        </span>
            </div>

            <div className="card-content">
                <p className="description">{technology.description}</p>

                {technology.category && (
                    <div className="category">
                        <strong>Категория:</strong> {technology.category}
                    </div>
                )}

                {technology.difficulty && (
                    <div className="difficulty">
                        <strong>Сложность:</strong> {technology.difficulty}
                    </div>
                )}

                {technology.deadline && (
                    <div className="deadline">
                        <strong>Дедлайн:</strong> {new Date(technology.deadline).toLocaleDateString()}
                    </div>
                )}
            </div>

            <div className="card-actions">
                <button
                    className="btn-notes"
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowNotes(!showNotes)
                    }}
                >
                    Заметки
                </button>

                {technology.resources && technology.resources.length > 0 && (
                    <div className="resources">
                        <strong>Ресурсы:</strong>
                        <ul>
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
            </div>

            {showNotes && (
                <div className="notes-section" onClick={(e) => e.stopPropagation()}>
                    <h4>Мои заметки:</h4>
                    <textarea
                        value={localNotes}
                        onChange={handleNotesChange}
                        placeholder="Записывайте сюда важные моменты..."
                        rows="3"
                        className="notes-textarea"
                    />
                    <div className="notes-hint">
                        {localNotes.length > 0
                            ? `Заметка сохранена (${localNotes.length} символов)`
                            : 'Добавьте заметку'
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default TechnologyCard