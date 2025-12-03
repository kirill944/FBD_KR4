import React from 'react'
import { Link } from 'react-router-dom'
import useTechnologies from '../hooks/useTechnologies'

function Home() {
    const {
        technologies,
        markAllCompleted,
        resetAllStatuses,
        getStats
    } = useTechnologies()

    const stats = getStats()

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добро пожаловать в Трекер технологий</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            {/* Progress Section */}
            <div className="progress-section">
                <h2>Общий прогресс: {stats.progress}%</h2>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{width: `${stats.progress}%`}}
                    ></div>
                </div>
            </div>

            {/* Recent Technologies */}
            <div className="recent-technologies">
                <h2>Недавние технологии</h2>
                {technologies.length > 0 ? (
                    <div className="technologies-grid">
                        {technologies.slice(0, 3).map(tech => (
                            <div key={tech.id} className="technology-preview">
                                <h3>{tech.title}</h3>
                                <p>{tech.description}</p>
                                <div className="tech-meta">
                                    <span className={`status status-${tech.status}`}>
                                        {tech.status === 'completed' ? '✅' :
                                            tech.status === 'in-progress' ? '🔄' : '⏳'}
                                        {tech.status}
                                    </span>
                                    <Link to={`/technology/${tech.id}`} className="btn-link">
                                        Подробнее →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Технологий пока нет. Добавьте первую технологию!</p>
                        <Link to="/add-technology" className="btn btn-primary">
                            Добавить технологию
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <h2>Быстрая статистика</h2>
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Всего технологий</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.completed}</div>
                        <div className="stat-label">Изучено</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.inProgress}</div>
                        <div className="stat-label">В процессе</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.progress}%</div>
                        <div className="stat-label">Прогресс</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home