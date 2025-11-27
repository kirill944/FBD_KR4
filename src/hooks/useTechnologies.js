import React from 'react'
import useLocalStorage from './useLocalStorage'

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, работа с props и state',
        status: 'completed',
        category: 'frontend',
        difficulty: 'beginner',
        resources: ['https://react.dev', 'https://ru.reactjs.org'],
        notes: 'Освоил основы компонентов и хуков'
    },
    {
        id: 2,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript, работа с модулями и NPM',
        status: 'in-progress',
        category: 'backend',
        difficulty: 'beginner',
        resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
        notes: 'Изучаю модульную систему и Event Loop'
    },
    {
        id: 3,
        title: 'TypeScript',
        description: 'Типизированное надмножество JavaScript для масштабируемых приложений',
        status: 'not-started',
        category: 'language',
        difficulty: 'intermediate',
        resources: ['https://www.typescriptlang.org'],
        notes: ''
    },
    {
        id: 4,
        title: 'MongoDB',
        description: 'NoSQL база данных для современных веб-приложений',
        status: 'not-started',
        category: 'database',
        difficulty: 'intermediate',
        resources: ['https://www.mongodb.com'],
        notes: ''
    }
]

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies)

    const addTechnology = (techData) => {
        const newTech = {
            id: Date.now(),
            ...techData,
            createdAt: new Date().toISOString()
        }
        setTechnologies(prev => [...prev, newTech])
        return newTech
    }

    const updateTechnology = (techId, updates) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, ...updates } : tech
            )
        )
    }

    const updateStatus = (techId, newStatus) => {
        updateTechnology(techId, { status: newStatus })
    }

    const updateNotes = (techId, newNotes) => {
        updateTechnology(techId, { notes: newNotes })
    }

    const deleteTechnology = (techId) => {
        setTechnologies(prev => prev.filter(tech => tech.id !== techId))
    }

    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        )
    }

    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        )
    }

    const getRandomTechnology = () => {
        const notStarted = technologies.filter(tech => tech.status === 'not-started')
        if (notStarted.length === 0) return null
        const randomIndex = Math.floor(Math.random() * notStarted.length)
        return notStarted[randomIndex]
    }

    const calculateProgress = () => {
        if (technologies.length === 0) return 0
        const completed = technologies.filter(tech => tech.status === 'completed').length
        return Math.round((completed / technologies.length) * 100)
    }

    const getStats = () => {
        const total = technologies.length
        const completed = technologies.filter(tech => tech.status === 'completed').length
        const inProgress = technologies.filter(tech => tech.status === 'in-progress').length
        const notStarted = technologies.filter(tech => tech.status === 'not-started').length

        const categoryStats = {}
        technologies.forEach(tech => {
            const category = tech.category || 'Без категории'
            if (!categoryStats[category]) {
                categoryStats[category] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 }
            }
            categoryStats[category].total++
            categoryStats[category][tech.status]++
        })

        return {
            total,
            completed,
            inProgress,
            notStarted,
            progress: calculateProgress(),
            categoryStats
        }
    }

    return {
        technologies,
        addTechnology,
        updateTechnology,
        updateStatus,
        updateNotes,
        deleteTechnology,
        markAllCompleted,
        resetAllStatuses,
        getRandomTechnology,
        getStats,
        progress: calculateProgress()
    }
}

export default useTechnologies