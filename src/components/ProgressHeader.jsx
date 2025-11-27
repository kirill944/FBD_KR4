import React from 'react'
import ProgressBar from './ProgressBar'

function ProgressHeader({ technologies }) {
    const total = technologies.length
    const completed = technologies.filter(tech => tech.status === 'completed').length
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    const getCategoryStats = () => {
        const categories = {}
        technologies.forEach(tech => {
            const category = tech.category || 'Без категории'
            if (!categories[category]) {
                categories[category] = { total: 0, completed: 0 }
            }
            categories[category].total++
            if (tech.status === 'completed') {
                categories[category].completed++
            }
        })
        return categories
    }

    const categoryStats = getCategoryStats()

    return (
        <div className="progress-header">
            <div className="progress-overview">
                <h2>Общий прогресс</h2>
                <ProgressBar
                    progress={progressPercentage}
                    label={`${completed} из ${total} технологий изучено`}
                    color="#27ae60"
                    height={25}
                    animated={true}
                />
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number" style={{ color: '#27ae60' }}>
                        {completed}
                    </div>
                    <div className="stat-label">Завершено</div>
                </div>

                <div className="stat-card">
                    <div className="stat-number" style={{ color: '#f39c12' }}>
                        {inProgress}
                    </div>
                    <div className="stat-label">В процессе</div>
                </div>

                <div className="stat-card">
                    <div className="stat-number" style={{ color: '#e74c3c' }}>
                        {notStarted}
                    </div>
                    <div className="stat-label">Не начато</div>
                </div>

                <div className="stat-card">
                    <div className="stat-number" style={{ color: '#3498db' }}>
                        {progressPercentage}%
                    </div>
                    <div className="stat-label">Общий прогресс</div>
                </div>
            </div>

            {Object.keys(categoryStats).length > 0 && (
                <div className="category-progress">
                    <h3>Прогресс по категориям</h3>
                    <div className="category-bars">
                        {Object.entries(categoryStats).map(([category, stats]) => {
                            const percentage = Math.round((stats.completed / stats.total) * 100)
                            return (
                                <div key={category} className="category-bar">
                                    <div className="category-info">
                                        <span className="category-name">{category}</span>
                                        <span className="category-stats">
                      {stats.completed}/{stats.total} ({percentage}%)
                    </span>
                                    </div>
                                    <ProgressBar
                                        progress={percentage}
                                        height={12}
                                        showPercentage={false}
                                        color="#9b59b6"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProgressHeader