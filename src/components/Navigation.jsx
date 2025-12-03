import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    IconButton,
    Tooltip
} from '@mui/material'
import {
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon
} from '@mui/icons-material'

function Navigation({ isLoggedIn, username, onLogout, theme, toggleTheme }) {
    const location = useLocation()

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/FBD_KR4/">
                    <h2>Трекер технологий</h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link
                        to="/FBD_KR4/"
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Главная
                    </Link>
                </li>

                {isLoggedIn ? (
                    <>
                        <li>
                            <Link
                                to="/FBD_KR4/statistics"
                                className={location.pathname === '/statistics' ? 'active' : ''}
                            >
                                Статистика
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/FBD_KR4/data-import-export"
                                className={location.pathname === '/data-import-export' ? 'active' : ''}
                            >
                                Импорт/Экспорт
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/FBD_KR4/settings"
                                className={location.pathname === '/dashboard' ? 'active' : ''}
                            >
                                Настройки
                            </Link>
                        </li>

                        {/* Кнопка переключения темы */}
                        <li className="theme-toggle-item">
                            <Tooltip title={theme.mode === 'dark' ? "Светлая тема" : "Тёмная тема"}>
                                <IconButton
                                    onClick={toggleTheme}
                                    color="inherit"
                                    aria-label="переключить тему"
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    {theme.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </Tooltip>
                        </li>

                        <li className="user-info">
                            <span>Привет, {username}</span>
                            <button onClick={onLogout} className="btn-logout">
                                Выйти
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link
                            to="/FBD_KR4/login"
                            className={location.pathname === '/login' ? 'active' : ''}
                        >
                            Войти
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Navigation