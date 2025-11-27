import React from 'react';
import {
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import {
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon
} from '@mui/icons-material';

const ThemeToggle = ({ darkMode, onToggle }) => {
    return (
        <Tooltip title={darkMode ? 'Светлая тема' : 'Тёмная тема'}>
            <IconButton
                color="inherit"
                onClick={onToggle}
                sx={{
                    ml: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'rotate(180deg)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                {darkMode ? <LightIcon /> : <DarkIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;