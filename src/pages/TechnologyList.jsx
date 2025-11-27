import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useTechnologies from '../hooks/useTechnologies'
import TechnologyCard from '../components/TechnologyCard'

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

    const filteredTechnologies = technologies.filter(tech => {
        const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || tech.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
    })

    const categories = [...new Set(technologies.map(tech => tech.category).filter(Boolean))]

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            {/* Фильтры и поиск */}
            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск по названию, описанию или заметкам..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-results-count">
            Найдено: {filteredTechnologies.length}
          </span>
                </div>

                <div className="filter-controls">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Все статусы</option>
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершено</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Все категории</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setStatusFilter('all')
                            setCategoryFilter('all')
                        }}
                        className="btn btn-secondary"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            </div>

            <div className="quick-actions">
            <h2>Быстрые действия</h2>
            <div className="action-buttons">
                <button onClick={markAllCompleted} className="btn btn-success">
                    Отметить все как выполненные
                </button>
                <button onClick={resetAllStatuses} className="btn btn-warning">
                    Сбросить все статусы
                </button>
            </div>
        </div>

            {/* Список технологий */}
            <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                    <TechnologyCard
                        key={tech.id}
                        technology={tech}
                        onStatusChange={updateStatus}
                        onNotesChange={updateNotes}
                    />
                ))}
            </div>

            {filteredTechnologies.length === 0 && (
                <div className="empty-state">
                    <p>Технологий не найдено.</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        Добавить первую технологию
                    </Link>
                </div>
            )}
        </div>
    )
}

export default TechnologyList