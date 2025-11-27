import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navigation from './components/Navigation';
import TechnologyForm from './components/TechnologyForm';
import ProtectedRoute from './components/ProtectedRoute';
import TechnologiesPage from './pages/TechnologyList';
import StatisticsPage from './pages/Statistics';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import DataImportExportPage from './pages/DataImportExport';
import NotificationContainer from './components/NotificationContainer';
import { useTheme } from './hooks/useTheme';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(true);
    const [username, setUsername] = useLocalStorage('username', 'Пользователь');
    const { theme } = useTheme();

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('Гость');
    };

    const handleSaveTechnology = (technologyData) => {
        console.log('Сохранение технологии:', technologyData);
        // Здесь будет логика сохранения
        alert('Технология сохранена!');
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="App">
                    <Navigation
                        isLoggedIn={isLoggedIn}
                        username={username}
                        onLogout={handleLogout}
                    />

                    <main className="main-content" style={{ padding: '20px' }}>
                        <Routes>
                            {/* Защищенные маршруты */}
                            <Route
                                path="/FBD_KR4/"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <TechnologiesPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/FBD_KR4/statistics"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <StatisticsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/FBD_KR4/data-import-export"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <DataImportExportPage />
                                    </ProtectedRoute>}
                            />

                            <Route
                                path="/FBD_KR4/add-technology"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <TechnologyForm
                                            onSave={handleSaveTechnology}
                                            onCancel={() => window.history.back()}
                                        />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/FBD_KR4/settings"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Страница входа */}
                            <Route
                                path="/FBD_KR4/login"
                                element={
                                    <LoginPage />
                                }
                            />

                            <Route path="*" element={<div><h1>404 - Страница не найдена</h1></div>} />
                        </Routes>
                    </main>

                    {/* Контейнер для уведомлений */}
                    <NotificationContainer />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;