/**
 * Telegram WebApp utilities
 */

export const initTelegramWebApp = () => {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Set theme
        if (tg.colorScheme === 'dark') {
            document.documentElement.classList.add('dark');
        }

        console.log('✅ Telegram WebApp initialized');
    } else {
        console.warn('⚠️ Telegram WebApp not available (running in browser)');
    }
};

export const hapticFeedback = {
    light: () => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    },
    medium: () => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    },
    heavy: () => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('heavy');
    },
    success: () => {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    },
    warning: () => {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('warning');
    },
    error: () => {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    }
};
