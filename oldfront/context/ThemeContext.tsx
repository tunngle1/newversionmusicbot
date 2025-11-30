import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Пытаемся получить тему из localStorage
        const savedTheme = localStorage.getItem('theme');
        // Проверяем системные настройки, если нет сохраненной темы
        if (!savedTheme) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return (savedTheme as Theme) || 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Удаляем старый класс и добавляем новый
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Сохраняем в localStorage
        localStorage.setItem('theme', theme);

        // Обновляем meta theme-color для мобильных браузеров/PWA
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
        }

        // Обновляем цвет хедера Telegram WebApp
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor(theme === 'dark' ? '#000000' : '#ffffff');
            window.Telegram.WebApp.setBackgroundColor(theme === 'dark' ? '#000000' : '#ffffff');
        }

    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
