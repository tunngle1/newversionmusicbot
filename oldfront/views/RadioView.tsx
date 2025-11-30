import React, { useState, useEffect } from 'react';
import { Radio as RadioIcon, Heart, Play, Loader } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { RadioStation } from '../types';
import { getRadioStations } from '../utils/api';
import { hapticFeedback } from '../utils/telegram';

const RadioView: React.FC = () => {
    const {
        playRadio,
        currentRadio,
        isRadioMode,
        isPlaying,
        togglePlay,
        favoriteRadios,
        toggleFavoriteRadio
    } = usePlayer();

    const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load radio stations
    useEffect(() => {
        const loadRadio = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const stations = await getRadioStations();
                setRadioStations(stations);
            } catch (err) {
                console.error('Failed to load radio stations:', err);
                setError('Не удалось загрузить радиостанции');
            } finally {
                setIsLoading(false);
            }
        };
        loadRadio();
    }, []);

    // Sort stations: favorites first
    const sortedStations = [...radioStations].sort((a, b) => {
        const aFav = favoriteRadios.has(a.id);
        const bFav = favoriteRadios.has(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    const handleRadioPlay = (station: RadioStation) => {
        hapticFeedback.light();
        if (isRadioMode && currentRadio?.id === station.id) {
            togglePlay();
        } else {
            playRadio(station);
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent, radioId: string) => {
        e.stopPropagation();
        toggleFavoriteRadio(radioId);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className="mt-4 text-gray-400">Загрузка радиостанций...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <RadioIcon className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    if (sortedStations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <RadioIcon className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400">Радиостанции не найдены</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 space-y-6 animate-fade-in-up pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Радио
                </h1>
                <RadioIcon className="w-6 h-6 text-blue-400" />
            </div>

            {/* Radio Stations Grid */}
            <div className="grid grid-cols-1 gap-3">
                {sortedStations.map((station) => {
                    const isCurrentStation = isRadioMode && currentRadio?.id === station.id;
                    const isFavorite = favoriteRadios.has(station.id);

                    return (
                        <div
                            key={station.id}
                            onClick={() => handleRadioPlay(station)}
                            className={`relative p-4 rounded-xl glass-panel transition-all cursor-pointer group ${isCurrentStation
                                    ? 'bg-blue-500/20 border-blue-500/30'
                                    : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Play Button */}
                                <button
                                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCurrentStation && isPlaying
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isCurrentStation && isPlaying ? (
                                        <div className="flex gap-1">
                                            <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    ) : (
                                        <Play size={20} fill="currentColor" />
                                    )}
                                </button>

                                {/* Station Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{station.name}</h3>
                                    <p className="text-sm text-gray-400 truncate">{station.genre || 'Радио'}</p>
                                </div>

                                {/* Favorite Button */}
                                <button
                                    onClick={(e) => handleToggleFavorite(e, station.id)}
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite
                                            ? 'text-red-500'
                                            : 'text-gray-400 hover:text-red-400'
                                        }`}
                                >
                                    <Heart
                                        size={20}
                                        fill={isFavorite ? 'currentColor' : 'none'}
                                        className="transition-transform hover:scale-110"
                                    />
                                </button>
                            </div>

                            {/* Playing Indicator */}
                            {isCurrentStation && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RadioView;
