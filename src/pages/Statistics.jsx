import React, { useState } from 'react'
import useTechnologies from '../hooks/useTechnologies'
import ProgressBar from '../components/ProgressBar'

function Statistics() {
    const { getStats } = useTechnologies()
    const [timeRange, setTimeRange] = useState('all')

    const stats = getStats()

    const getCategoryProgress = (categoryStats) => {
        return Object.entries(categoryStats).map(([category, data]) => ({
            category,
            progress: Math.round((data.completed / data.total) * 100),
            ...data
        })).sort((a, b) => b.progress - a.progress)
    }

    const categoryProgress = getCategoryProgress(stats.categoryStats)

    return (
        <div className="page">
            <div className="page-header">
                <h1>Статистика изучения</h1>
            </div>

            <div className="stats-overview">
                <div className="stats-grid">
                    <div className="stat-card large">
                        <div className="stat-number">{stats.progress}%</div>
                        <div className="stat-label">Общий прогресс</div>
                        <ProgressBar
                            progress={stats.progress}
                            height={15}
                            showPercentage={false}
                            color="#27ae60"
                        />
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Всего технологий</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">{stats.completed}</div>
                        <div className="stat-label">Завершено</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">{stats.inProgress}</div>
                        <div className="stat-label">В процессе</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">{stats.notStarted}</div>
                        <div className="stat-label">Не начато</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics