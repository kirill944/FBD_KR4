import { useState, useEffect } from 'react';

function useWeather() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для получения погоды по геолокации
    const fetchWeatherByLocation = async (latitude, longitude) => {
        try {
            setLoading(true);
            setError(null);

            // Используем OpenWeatherMap API (нужен API ключ)
            // Для демо используем другой открытый API без ключа
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
            );

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();
            setWeatherData(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке погоды:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Функция для получения погоды по городу
    const fetchWeatherByCity = async (city) => {
        try {
            setLoading(true);
            setError(null);

            // Сначала получаем координаты города
            const geocodeResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            );

            if (!geocodeResponse.ok) {
                throw new Error(`Ошибка геокодирования: ${geocodeResponse.status}`);
            }

            const geocodeData = await geocodeResponse.json();

            if (!geocodeData.results || geocodeData.results.length === 0) {
                throw new Error('Город не найден');
            }

            const { latitude, longitude, name, country } = geocodeData.results[0];

            // Затем получаем погоду по координатам
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
            );

            if (!weatherResponse.ok) {
                throw new Error(`Ошибка погоды: ${weatherResponse.status}`);
            }

            const weatherData = await weatherResponse.json();

            const enrichedData = {
                ...weatherData,
                location: {
                    name,
                    country,
                    latitude,
                    longitude
                }
            };

            setWeatherData(enrichedData);
            return enrichedData;
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке погоды:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Получаем погоду по текущему местоположению при монтировании
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByLocation(latitude, longitude);
                },
                (err) => {
                    console.warn('Геолокация недоступна:', err.message);
                    // По умолчанию погода для Москвы
                    fetchWeatherByCity('Москва');
                }
            );
        } else {
            // Если геолокация не поддерживается, используем Москву по умолчанию
            fetchWeatherByCity('Москва');
        }
    }, []);

    // Функция для обновления погоды
    const refetchWeather = () => {
        if (weatherData?.location) {
            return fetchWeatherByCity(weatherData.location.name);
        } else {
            // Если нет данных о местоположении, используем геолокацию
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherByLocation(latitude, longitude);
                    },
                    () => fetchWeatherByCity('Москва')
                );
            } else {
                fetchWeatherByCity('Москва');
            }
        }
    };

    // Функция для изменения города
    const changeCity = (city) => {
        return fetchWeatherByCity(city);
    };

    // Функция для получения описания погоды по коду
    const getWeatherDescription = (weatherCode) => {
        const weatherMap = {
            0: { description: 'Ясно', icon: '☀️' },
            1: { description: 'Преимущественно ясно', icon: '🌤️' },
            2: { description: 'Переменная облачность', icon: '⛅' },
            3: { description: 'Пасмурно', icon: '☁️' },
            45: { description: 'Туман', icon: '🌫️' },
            48: { description: 'Изморозь', icon: '🌫️' },
            51: { description: 'Морось', icon: '🌦️' },
            53: { description: 'Умеренная морось', icon: '🌦️' },
            55: { description: 'Сильная морось', icon: '🌧️' },
            56: { description: 'Ледяная морось', icon: '🌧️❄️' },
            57: { description: 'Сильная ледяная морось', icon: '🌧️❄️' },
            61: { description: 'Небольшой дождь', icon: '🌦️' },
            63: { description: 'Умеренный дождь', icon: '🌧️' },
            65: { description: 'Сильный дождь', icon: '🌧️⛈️' },
            66: { description: 'Ледяной дождь', icon: '🌧️❄️' },
            67: { description: 'Сильный ледяной дождь', icon: '🌧️❄️' },
            71: { description: 'Небольшой снег', icon: '🌨️' },
            73: { description: 'Умеренный снег', icon: '🌨️' },
            75: { description: 'Сильный снег', icon: '❄️' },
            77: { description: 'Снежные зерна', icon: '🌨️' },
            80: { description: 'Небольшой ливень', icon: '🌧️' },
            81: { description: 'Умеренный ливень', icon: '🌧️' },
            82: { description: 'Сильный ливень', icon: '⛈️' },
            85: { description: 'Небольшой снегопад', icon: '🌨️' },
            86: { description: 'Сильный снегопад', icon: '❄️' },
            95: { description: 'Гроза', icon: '⛈️' },
            96: { description: 'Гроза с градом', icon: '⛈️🧊' },
            99: { description: 'Сильная гроза с градом', icon: '⛈️🧊' }
        };

        return weatherMap[weatherCode] || { description: 'Неизвестно', icon: '❓' };
    };

    return {
        weatherData,
        loading,
        error,
        refetchWeather,
        changeCity,
        getWeatherDescription
    };
}

export default useWeather;