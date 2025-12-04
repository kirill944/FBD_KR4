import React from 'react'
import { useNavigate } from 'react-router-dom'
import TechnologyForm from '../components/TechnologyForm'
import useTechnologies from '../hooks/useTechnologies'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Breadcrumbs,
    Link as MuiLink
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

function AddTechnology() {
    const navigate = useNavigate()
    const { addTechnology } = useTechnologies()

    const handleSave = (techData) => {
        addTechnology(techData)
        navigate('/FBD_KR4/technologies')
    }

    const handleCancel = () => {
        navigate('/FBD_KR4/technologies')
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <MuiLink
                        color="inherit"
                        href="/FBD_KR4/technologies"
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('/FBD_KR4/technologies')
                        }}
                    >
                        Технологии
                    </MuiLink>
                    <Typography color="text.primary">Добавление технологии</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Добавление новой технологии
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                    >
                        Назад к списку
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 3 }}>
                <TechnologyForm
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Paper>
        </Container>
    )
}

export default AddTechnology