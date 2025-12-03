import { useState, useEffect, useMemo } from 'react';
import { createAppTheme } from './theme';
import useLocalStorage from './useLocalStorage';

export const useTheme = () => {
    const [mode, setMode] = useLocalStorage('theme-mode', 'light');

    const theme = useMemo(() =>
            createAppTheme(mode),
        [mode]
    );

    const toggleTheme = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return {
        theme,
        toggleTheme,
        mode
    };
};