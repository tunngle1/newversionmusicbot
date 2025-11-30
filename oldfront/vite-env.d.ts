/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    Telegram?: {
        WebApp: {
            ready: () => void;
            expand: () => void;
            close: () => void;
            setHeaderColor: (color: string) => void;
            setBackgroundColor: (color: string) => void;
            MainButton: {
                text: string;
                color: string;
                textColor: string;
                isVisible: boolean;
                isActive: boolean;
                show: () => void;
                hide: () => void;
                enable: () => void;
                disable: () => void;
                onClick: (callback: () => void) => void;
                offClick: (callback: () => void) => void;
                showProgress: (leaveActive: boolean) => void;
                hideProgress: () => void;
            };
            BackButton: {
                isVisible: boolean;
                show: () => void;
                hide: () => void;
                onClick: (callback: () => void) => void;
                offClick: (callback: () => void) => void;
            };
            HapticFeedback: {
                impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
                notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
                selectionChanged: () => void;
            };
            initData: string;
            initDataUnsafe: {
                user?: {
                    id: number;
                    first_name: string;
                    last_name?: string;
                    username?: string;
                    language_code?: string;
                    is_premium?: boolean;
                };
                start_param?: string;
            };
            themeParams: {
                bg_color?: string;
                text_color?: string;
                hint_color?: string;
                link_color?: string;
                button_color?: string;
                button_text_color?: string;
                secondary_bg_color?: string;
            };
            isExpanded: boolean;
            viewportHeight: number;
            viewportStableHeight: number;
            platform: string;
            version: string;
        };
    };
}
