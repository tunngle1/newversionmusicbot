import React from 'react';
import { Download, Smartphone, MessageCircle, X } from 'lucide-react';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownloadToApp: () => void;
    onDownloadToChat: () => void;
    trackTitle: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
    isOpen,
    onClose,
    onDownloadToApp,
    onDownloadToChat,
    trackTitle
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 w-full max-w-md p-6 rounded-t-3xl border-t border-white/10 shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Download className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Скачать трек</h3>
                            <p className="text-sm text-gray-400 truncate max-w-[200px]">{trackTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => {
                            onDownloadToApp();
                            onClose();
                        }}
                        className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-4"
                    >
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Smartphone size={24} className="text-blue-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-semibold">В приложение</p>
                            <p className="text-gray-400 text-sm">Сохранить в локальное хранилище</p>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            onDownloadToChat();
                            onClose();
                        }}
                        className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-4"
                    >
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <MessageCircle size={24} className="text-purple-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-semibold">В чат</p>
                            <p className="text-gray-400 text-sm">Отправить через Telegram бот</p>
                        </div>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl font-medium text-gray-300 transition-colors"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
};

export default DownloadModal;
