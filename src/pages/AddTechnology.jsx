import React from 'react'
import { useNavigate } from 'react-router-dom'
import TechnologyForm from '../components/TechnologyForm'
import useTechnologies from '../hooks/useTechnologies'

function AddTechnology() {
    const navigate = useNavigate()
    const { addTechnology } = useTechnologies()

    const handleSave = (techData) => {
        addTechnology(techData)
        navigate('/technologies')
    }

    const handleCancel = () => {
        navigate('/technologies')
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавление новой технологии</h1>
            </div>

            <TechnologyForm
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default AddTechnology