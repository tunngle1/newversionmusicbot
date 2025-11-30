import React from 'react';

interface ArtistSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    artists: string[];
    onSelectArtist: (artist: string) => void;
}

const ArtistSelectorModal: React.FC<ArtistSelectorModalProps> = ({
    isOpen,
    onClose,
    artists,
    onSelectArtist
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 w-full max-w-sm p-6 rounded-t-2xl border-t border-white/10 shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4 text-white">Выберите артиста</h3>

                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {artists.map((artist, index) => (
                        <button
                            key={index}
                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left border border-white/10"
                            onClick={() => {
                                onSelectArtist(artist);
                                onClose();
                            }}
                        >
                            <span className="text-white font-medium">{artist}</span>
                        </button>
                    ))}
                </div>

                <button
                    className="w-full mt-4 py-3 bg-gray-800 rounded-xl font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                >
                    Отмена
                </button>
            </div>
        </div>
    );
};

export default ArtistSelectorModal;
