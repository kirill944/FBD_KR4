import React, { useState } from 'react'
import Modal from './Modal'

function QuickActions({
                          technologies,
                          onMarkAllCompleted,
                          onResetAll,
                          onRandomSelect
                      }) {
    const [showExportModal, setShowExportModal] = useState(false)

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        }
        const dataStr = JSON.stringify(data, null, 2)

        // Создание и скачивание файла
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setShowExportModal(true)
    }

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button onClick={onMarkAllCompleted} className="btn btn-success">
                    Отметить все как выполненные
                </button>
                <button onClick={onResetAll} className="btn btn-warning">
                    Сбросить все статусы
                </button>
                <button onClick={onRandomSelect} className="btn btn-info">
                    Случайный выбор
                </button>
                <button onClick={handleExport} className="btn btn-primary">
                    Экспорт данных
                </button>
            </div>

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <p>Данные успешно экспортированы!</p>
                <p>Файл скачан автоматически.</p>
                <button
                    onClick={() => setShowExportModal(false)}
                    className="btn btn-primary"
                >
                    Закрыть
                </button>
            </Modal>
        </div>
    )
}

export default QuickActions