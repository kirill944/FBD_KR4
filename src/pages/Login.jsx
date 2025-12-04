import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from "../hooks/useLocalStorage.js"
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Alert,
    Card,
    CardContent,
    Divider
} from '@mui/material'
import { Lock, Person, Login as LoginIcon } from '@mui/icons-material'


function Login({ onLogin }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = React.useState(true);
    const [username, setUsername] = useLocalStorage('username', 'Пользователь');

    const handleLogin = () => {
        if (username && password) {
            setIsLoggedIn(true);
            setUsername(username);

        } else {
            setError('Заполните все поля')
        }
    };

    const handleDemoLogin = () => {
        setUsername('admin')
        setPassword('password')
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Lock sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography component="h1" variant="h5">
                            Вход в систему
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={<LoginIcon />}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Войти
                        </Button>
                    </Box>

                    <Divider sx={{ width: '100%', my: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Демо доступ
                        </Typography>
                    </Divider>

                    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Для тестирования используйте:
                            </Typography>
                            <Typography variant="body2">
                                <strong>Логин:</strong> admin
                            </Typography>
                            <Typography variant="body2">
                                <strong>Пароль:</strong> password
                            </Typography>
                        </CardContent>
                    </Card>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleDemoLogin}
                    >
                        Заполнить демо данные
                    </Button>
                </Paper>
            </Box>
        </Container>
    )
}

export default Login