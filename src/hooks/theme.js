import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
            light: mode === 'light' ? '#4791db' : '#e3f2fd',
            dark: mode === 'light' ? '#115293' : '#42a5f5',
        },
        secondary: {
            main: mode === 'light' ? '#dc004e' : '#f48fb1',
            light: mode === 'light' ? '#e33371' : '#fce4ec',
            dark: mode === 'light' ? '#9a0036' : '#ad1457',
        },
        background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
        text: {
            primary: '#121212',
            secondary: '#121212',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'light'
                        ? '0 2px 10px rgba(0,0,0,0.1)'
                        : '0 2px 10px rgba(0,0,0,0.3)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? '#1976d2' : '#0d47a1',
                },
            },
        },
    },
});