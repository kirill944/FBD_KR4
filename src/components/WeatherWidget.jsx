import React, { useState } from 'react';
import useWeather from '../hooks/useWeather';
import './WeatherWidget.css';

function WeatherWidget() {
    const {
        weatherData,
        loading,
        error,
        refetchWeather,
        changeCity,
        getWeatherDescription
    } = useWeather();

    const [cityInput, setCityInput] = useState('');
    const [isChangingCity, setIsChangingCity] = useState(false);

    const handleCityChange = async (e) => {
        e.preventDefault();
        if (!cityInput.trim()) return;

        setIsChangingCity(true);
        try {
            await changeCity(cityInput);
            setCityInput('');
        } catch (err) {
            console.error('Ошибка при смене города:', err);
        } finally {
            setIsChangingCity(false);
        }
    };

    const formatTemperature = (temp) => {
        if (temp === undefined || temp === null) return '--';
        return `${Math.round(temp)}°C`;
    };

    // Форматирование времени
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && !weatherData) {
        return (
            <div className="weather-widget loading">
                <div className="weather-spinner"></div>
                <p>Загрузка погоды...</p>
            </div>
        );
    }

    if (error && !weatherData) {
        return (
            <div className="weather-widget error">
                <p className="weather-error">Не удалось загрузить погоду</p>
                <button onClick={refetchWeather} className="weather-retry-btn">
                    Попробовать снова
                </button>
            </div>
        );
    }

    if (!weatherData) return null;

    const { current, location } = weatherData;
    const weatherInfo = getWeatherDescription(current?.weather_code);
    const temperature = current?.temperature_2m;
    const humidity = current?.relative_humidity_2m;
    const windSpeed = current?.wind_speed_10m;

    return (
        <div className="weather-widget">
            <div className="weather-header">
                <h3>Погода сейчас</h3>
                <button
                    onClick={refetchWeather}
                    className="weather-refresh-btn"
                    disabled={loading}
                    title="Обновить погоду"
                >
                    {loading ? '⟳' : '↻'}
                </button>
            </div>

            {error && (
                <div className="weather-error-message">
                    {error}
                </div>
            )}

            <div className="weather-content">
                <div className="weather-main">
                    <div className="weather-icon">
                        <span className="weather-icon-large">{weatherInfo.icon}</span>
                    </div>
                    <div className="weather-temp">
                        <div className="temp-value">{formatTemperature(temperature)}</div>
                        <div className="temp-description">{weatherInfo.description}</div>
                    </div>
                </div>

                <div className="weather-details">
                    <div className="weather-location">
                        <span className="location-icon"></span>
                        {location ? (
                            <span className="location-text">
                                {location.name}, {location.country}
                            </span>
                        ) : (
                            <span className="location-text">Определение местоположения...</span>
                        )}
                    </div>

                    <div className="weather-stats">
                        <div className="weather-stat">
                            <span className="stat-icon"></span>
                            <span className="stat-value">{windSpeed ? `${Math.round(windSpeed)} км/ч` : '--'}</span>
                            <span className="stat-label wind-label">Ветер</span>
                        </div>
                        <div className="weather-stat">
                            <span className="stat-icon"></span>
                            <span className="stat-value">{humidity ? `${humidity}%` : '--'}</span>
                            <span className="stat-label humidity-label">Влажность</span>
                        </div>
                    </div>
                </div>

                <form className="weather-city-form" onSubmit={handleCityChange}>
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        placeholder="Введите город..."
                        className="city-input"
                        disabled={isChangingCity}
                    />
                    <button
                        type="submit"
                        className="city-change-btn"
                        disabled={!cityInput.trim() || isChangingCity}
                    >
                        {isChangingCity ? '...' : 'Изменить'}
                    </button>
                </form>

                {current?.time && (
                    <div className="weather-update-time">
                        Обновлено: {formatTime(current.time)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherWidget;