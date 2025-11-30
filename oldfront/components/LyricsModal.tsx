import React from 'react';
import { X, FileText, Loader2, AlertCircle } from 'lucide-react';

interface LyricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    artist: string;
    lyrics: string | null;
    isLoading: boolean;
    error: string | null;
}

const LyricsModal: React.FC<LyricsModalProps> = ({
    isOpen,
    onClose,
    title,
    artist,
    lyrics,
    isLoading,
    error
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-heavy w-full h-full max-w-4xl max-h-[95vh] m-4 rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-scale-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Fixed */}
                <div className="flex-shrink-0 p-6 border-b border-white/10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <FileText className="text-blue-400" size={24} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
                                <p className="text-gray-400 text-sm">{artist}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div
                    className="flex-1 overflow-y-auto p-6 custom-scrollbar"
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
                            <p>Загрузка текста песни...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="p-4 bg-red-500/20 rounded-full mb-4">
                                <AlertCircle size={48} className="text-red-400" />
                            </div>
                            <p className="text-red-400 text-center mb-2 font-medium">Ошибка</p>
                            <p className="text-gray-400 text-center text-sm">{error}</p>
                        </div>
                    )}

                    {lyrics && !isLoading && !error && (
                        <div className="space-y-4">
                            <pre className="text-gray-200 whitespace-pre-wrap font-sans leading-relaxed text-lg">
                                {lyrics}
                            </pre>

                            {/* Copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(lyrics);
                                    if (window.Telegram?.WebApp?.HapticFeedback) {
                                        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                                    }
                                }}
                                className="w-full py-3 glass-button hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                            >
                                Скопировать текст
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LyricsModal;
