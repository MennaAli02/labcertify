import React, { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        const saved = localStorage.getItem('shalaby_app_theme');
        if (saved === 'dark' || saved === 'light')
            return saved;
        return 'light';
    });
    const setTheme = (t) => {
        setThemeState(t);
        localStorage.setItem('shalaby_app_theme', t);
    };
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    const isDark = theme === 'dark';
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [theme]);
    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark
    };
    return (<ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>);
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
