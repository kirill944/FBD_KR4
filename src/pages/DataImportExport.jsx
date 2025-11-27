import React, { useState } from 'react'
import useTechnologies from '../hooks/useTechnologies'

function DataImportExport() {
    const { technologies, markAllCompleted, resetAllStatuses } = useTechnologies()
    const [status, setStatus] = useState('')
    const [isDragging, setIsDragging] = useState(false)

    const exportToJSON = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            setStatus('Данные экспортированы в JSON')
            setTimeout(() => setStatus(''), 3000)
        } catch (error) {
            setStatus('Ошибка экспорта данных')
            console.error('Ошибка экспорта:', error)
        }
    }

    const importFromJSON = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result)

                if (!Array.isArray(imported)) {
                    throw new Error('Неверный формат данных')
                }

                // Сохраняем импортированные данные
                localStorage.setItem('technologies', JSON.stringify(imported))
                setStatus(`Импортировано ${imported.length} технологий`)
                setTimeout(() => {
                    setStatus('')
                    window.location.reload()
                }, 3000)
            } catch (error) {
                setStatus('Ошибка импорта: неверный формат файла')
                console.error('Ошибка импорта:', error)
            }
        }

        reader.readAsText(file)
        event.target.value = ''
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type === 'application/json') {
            const reader = new FileReader()
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result)
                    if (Array.isArray(imported)) {
                        localStorage.setItem('technologies', JSON.stringify(imported))
                        setStatus(`Импортировано ${imported.length} технологий`)
                        setTimeout(() => {
                            setStatus('')
                            window.location.reload()
                        }, 3000)
                    }
                } catch (error) {
                    setStatus('Ошибка импорта: неверный формат файла')
                }
            }
            reader.readAsText(file)
        }
    }

    const handleClearAll = () => {
        if (window.confirm('Вы уверены, что хотите удалить все технологии? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies')
            setStatus('Все данные удалены')
            setTimeout(() => {
                setStatus('')
                window.location.reload()
            }, 3000)
        }
    }

    const generateSampleData = () => {
        const sampleData = [
            {
                id: Date.now(),
                title: 'React Hooks',
                description: 'Изучение современных хуков React',
                status: 'not-started',
                category: 'frontend',
                difficulty: 'intermediate',
                resources: ['https://react.dev/reference/react'],
                notes: '',
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                title: 'Express.js',
                description: 'Фреймворк для создания веб-приложений на Node.js',
                status: 'not-started',
                category: 'backend',
                difficulty: 'beginner',
                resources: ['https://expressjs.com'],
                notes: '',
                createdAt: new Date().toISOString()
            }
        ]

        localStorage.setItem('technologies', JSON.stringify(sampleData))
        setStatus('Демо данные добавлены')
        setTimeout(() => {
            setStatus('')
            window.location.reload()
        }, 3000)
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Импорт и экспорт данных</h1>
            </div>

            {status && (
                <div className={`status-message ${status.includes('Ошибка') ? 'error' : 'success'}`}>
                    {status}
                </div>
            )}

            <div className="data-actions">
                <div className="action-section">
                    <h2>Экспорт данных</h2>
                    <p>Скачайте ваши данные в формате JSON для резервного копирования.</p>
                    <button
                        onClick={exportToJSON}
                        disabled={technologies.length === 0}
                        className="btn btn-primary"
                    >
                        Экспорт в JSON
                    </button>
                </div>

                <div className="action-section">
                    <h2>Импорт данных</h2>
                    <p>Загрузите ранее экспортированные данные из JSON файла.</p>

                    <label className="btn btn-secondary file-input-label">
                        Импорт из JSON
                        <input
                            type="file"
                            accept=".json"
                            onChange={importFromJSON}
                            style={{ display: 'none' }}
                        />
                    </label>

                    <div
                        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        Перетащите JSON-файл сюда
                    </div>
                </div>

                <div className="action-section">
                    <h2>Быстрые действия</h2>
                    <div className="quick-buttons">
                        <button onClick={markAllCompleted} className="btn btn-success">
                            Отметить все как выполненные
                        </button>
                        <button onClick={resetAllStatuses} className="btn btn-warning">
                            Сбросить все статусы
                        </button>
                        <button onClick={generateSampleData} className="btn btn-info">
                            Добавить демо данные
                        </button>
                        <button onClick={handleClearAll} className="btn btn-danger">
                            Удалить все данные
                        </button>
                    </div>
                </div>

                <div className="action-section">
                    <h2>Текущие данные</h2>
                    <div className="current-stats">
                        <p><strong>Всего технологий:</strong> {technologies.length}</p>
                        <p><strong>Завершено:</strong> {technologies.filter(t => t.status === 'completed').length}</p>
                        <p><strong>В процессе:</strong> {technologies.filter(t => t.status === 'in-progress').length}</p>
                        <p><strong>Не начато:</strong> {technologies.filter(t => t.status === 'not-started').length}</p>
                    </div>

                    {technologies.length > 0 && (
                        <div className="technologies-preview">
                            <h3>Предпросмотр технологий:</h3>
                            <div className="preview-list">
                                {technologies.slice(0, 5).map(tech => (
                                    <div key={tech.id} className="preview-item">
                                        <strong>{tech.title}</strong> - {tech.status}
                                    </div>
                                ))}
                                {technologies.length > 5 && (
                                    <div className="preview-more">
                                        ... и еще {technologies.length - 5} технологий
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DataImportExport