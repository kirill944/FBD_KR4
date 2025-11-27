import { useState, useEffect, useMemo } from 'react';
import { createAppTheme } from './theme';
import useLocalStorage from './useLocalStorage';

export const useTheme = () => {
    const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

    const theme = useMemo(() =>
            createAppTheme(darkMode ? 'dark' : 'light'),
        [darkMode]
    );

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return {
        darkMode,
        toggleDarkMode,
        theme
    };
};