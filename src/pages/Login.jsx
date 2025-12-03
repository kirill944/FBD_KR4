import React, { useState } from 'react'
import {redirect, useNavigate} from 'react-router-dom'
import useLocalStorage from "../hooks/useLocalStorage.js";


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
        <div className="page">
            <div className="login-container">
                <div className="login-form">
                    <h1>Вход в систему</h1>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Имя пользователя:</label>
                            <input
                                type="text"
                                value={username}
                                placeholder="Введите имя пользователя"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Пароль:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Войти
                        </button>
                    </form>

                    <div className="demo-info">
                        <p>Демо доступ:</p>
                        <p>Логин: <strong>admin</strong></p>
                        <p>Пароль: <strong>password</strong></p>
                        <button
                            onClick={handleDemoLogin}
                            className="btn btn-secondary"
                            style={{ marginTop: '10px' }}
                        >
                            Заполнить демо данные
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login