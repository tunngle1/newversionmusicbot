import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track, Playlist, RepeatMode, RadioStation, User, SearchMode } from '../types';
import { hapticFeedback } from '../utils/telegram';
import { api } from '../services/api';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface PlayerContextType {
    // Data
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    repeatMode: RepeatMode;
    queue: Track[];
    downloadedTracks: Set<string>;
    downloadProgress: Map<string, number>;
    isDownloading: string | null;
    isShuffle: boolean;

    // Actions
    playTrack: (track: Track, newQueue?: Track[]) => void;
    playRadio: (station: RadioStation) => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    seek: (time: number) => void;
    toggleRepeat: () => void;
    toggleShuffle: () => void;
    downloadTrack: (track: Track) => void;
    removeDownloadedTrack: (trackId: string) => void;

    // Search
    searchState: {
        query: string;
        results: Track[];
        isSearching: boolean;
        error: string | null;
        page: number;
        hasMore: boolean;
        searchMode: SearchMode;
        genreId: number | null;
    };
    setSearchState: React.Dispatch<React.SetStateAction<any>>;
    resetSearch: () => void;

    // User State
    user: User | null;
    refreshSubscriptionStatus: () => Promise<void>;

    // Favorites
    favorites: Track[];
    toggleFavorite: (track: Track) => Promise<void>;
    favoriteRadios: Set<string>;
    toggleFavoriteRadio: (radioId: string) => Promise<void>;
    markTrackAsDownloaded: (trackId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
    const [isRadioMode, setIsRadioMode] = useState(false);
    const [queue, setQueue] = useState<Track[]>([]);
    const [downloadedTracks, setDownloadedTracks] = useState<Set<string>>(new Set());
    const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(new Map());
    const [user, setUser] = useState<User | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
    const [isShuffle, setIsShuffle] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    // Favorites State
    const [favorites, setFavorites] = useState<Track[]>([]);
    const [favoriteRadios, setFavoriteRadios] = useState<Set<string>>(new Set());

    const toggleFavorite = async (track: Track) => {
        try {
            const isFav = favorites.some(f => f.id === track.id);
            if (isFav) {
                await storage.removeFromFavorites(track.id);
                setFavorites(prev => prev.filter(f => f.id !== track.id));
            } else {
                await storage.addToFavorites(track);
                setFavorites(prev => [...prev, track]);
            }
            hapticFeedback.medium();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const toggleFavoriteRadio = async (radioId: string) => {
        try {
            const isFav = favoriteRadios.has(radioId);
            if (isFav) {
                await storage.removeFavoriteRadio(radioId);
                setFavoriteRadios(prev => {
                    const next = new Set(prev);
                    next.delete(radioId);
                    return next;
                });
            } else {
                await storage.saveFavoriteRadio(radioId);
                setFavoriteRadios(prev => new Set(prev).add(radioId));
            }
            hapticFeedback.medium();
        } catch (error) {
            console.error('Error toggling favorite radio:', error);
        }
    };

    // Search State
    const [searchState, setSearchState] = useState({
        query: '',
        results: [] as Track[],
        isSearching: false,
        error: null as string | null,
        page: 1,
        hasMore: true,
        searchMode: 'all' as SearchMode,
        genreId: null as number | null
    });

    const resetSearch = () => {
        setSearchState({
            query: '',
            results: [],
            isSearching: false,
            error: null,
            page: 1,
            hasMore: true,
            searchMode: 'all',
            genreId: null
        });
    };

    // Refresh subscription status
    const refreshSubscriptionStatus = async () => {
        if (!user) return;

        try {
            const data = await api.getSubscriptionStatus(user.id);
            setUser(prev => prev ? {
                ...prev,
                subscription_status: data.subscription_status
            } : null);
        } catch (e) {
            console.error('Failed to refresh subscription status:', e);
        }
    };

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const queueRef = useRef(queue);
    const currentTrackRef = useRef(currentTrack);
    const repeatModeRef = useRef(repeatMode);
    const isShuffleRef = useRef(isShuffle);

    // Sync refs with state
    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
    useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
    useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);

    const nextTrack = async () => {
        const currentTrackVal = currentTrackRef.current;
        const currentQueue = queueRef.current;
        const isShuffleVal = isShuffleRef.current;
        const repeatModeVal = repeatModeRef.current;

        if (!currentTrackVal || currentQueue.length === 0) return;

        if (isShuffleVal) {
            const randomIndex = Math.floor(Math.random() * currentQueue.length);
            playTrack(currentQueue[randomIndex]);
            return;
        }

        const currentIndex = currentQueue.findIndex(t => t.id === currentTrackVal.id);

        if (currentIndex < currentQueue.length - 1) {
            playTrack(currentQueue[currentIndex + 1]);
        } else if (repeatModeVal === 'all') {
            playTrack(currentQueue[0]);
        } else {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };

    const prevTrack = () => {
        const currentTrackVal = currentTrackRef.current;
        const currentQueue = queueRef.current;

        if (!currentTrackVal || currentQueue.length === 0) return;
        const audio = audioRef.current;

        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        const currentIndex = currentQueue.findIndex(t => t.id === currentTrackVal.id);
        if (currentIndex > 0) {
            playTrack(currentQueue[currentIndex - 1]);
        } else {
            playTrack(currentQueue[currentQueue.length - 1]);
        }
    };

    // Auth and Load Data
    useEffect(() => {
        const init = async () => {
            // 1. Auth User
            if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
                const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
                try {
                    const response = await api.authUser({
                        id: tgUser.id,
                        username: tgUser.username,
                        first_name: tgUser.first_name,
                        last_name: tgUser.last_name,
                        auth_date: window.Telegram.WebApp.initDataUnsafe.auth_date || 0,
                        hash: window.Telegram.WebApp.initDataUnsafe.hash || ""
                    });
                    setUser(response.user);
                } catch (e) {
                    console.error("Auth failed:", e);
                }
            }

            // 2. Load Data
            try {
                const tracks = await storage.getAllTracks();
                const downloadedIds = new Set(tracks.filter(t => t.isLocal).map(t => t.id));
                setDownloadedTracks(downloadedIds);

                const loadedFavorites = await storage.getFavorites();
                const loadedFavoriteRadios = await storage.getFavoriteRadios();

                setFavorites(loadedFavorites);
                setFavoriteRadios(new Set(loadedFavoriteRadios));
            } catch (e) {
                console.error("Failed to load data:", e);
            }
        };

        init();
    }, []);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();

        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            const currentRepeatMode = repeatModeRef.current;

            if (currentRepeatMode === 'one') {
                audio.currentTime = 0;
                audio.play().catch(e => console.error("Repeat play error:", e));
                return;
            }

            nextTrack();
        };
        const handleError = (e: Event) => {
            console.error("Audio error:", e);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Manage playback when track changes
    const isCurrentTrackDownloaded = currentTrack ? downloadedTracks.has(currentTrack.id) : false;
    const blobUrlCache = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        const playAudio = async () => {
            if (currentTrack && audioRef.current) {
                try {
                    let src = currentTrack.url;

                    // Check if downloaded
                    if (isCurrentTrackDownloaded) {
                        try {
                            const savedTrack = await storage.getTrack(currentTrack.id);
                            if (savedTrack?.audioBlob) {
                                const blobUrl = URL.createObjectURL(savedTrack.audioBlob);
                                src = blobUrl;
                                console.log("Playing from local storage:", currentTrack.title);
                            }
                        } catch (e) {
                            console.error("Error loading local track:", e);
                        }
                    }

                    if (audioRef.current.src !== src) {
                        const wasPlaying = isPlaying;
                        audioRef.current.src = src;
                        audioRef.current.load();

                        if (wasPlaying) {
                            audioRef.current.play().catch(e => {
                                console.error("Play error (auto-play):", e);
                            });
                        }
                    }
                } catch (e) {
                    console.error("Play setup error:", e);
                }
            }
        };

        playAudio();
    }, [currentTrack, isCurrentTrackDownloaded]);

    // Control play/pause
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const playTrack = (track: Track, newQueue?: Track[]) => {
        if (newQueue) {
            setQueue(newQueue);
        }
        setCurrentTrack(track);
        setCurrentRadio(null);
        setIsRadioMode(false);
        setIsPlaying(true);
    };

    const playRadio = (station: RadioStation) => {
        setCurrentRadio(station);
        setCurrentTrack(null);
        setIsRadioMode(true);
        setIsPlaying(true);

        // Set audio source directly for radio
        if (audioRef.current) {
            audioRef.current.src = station.url;
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error("Radio play error:", e));
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    // Media Session API integration
    useEffect(() => {
        if ('mediaSession' in navigator) {
            if (currentTrack) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: currentTrack.title,
                    artist: currentTrack.artist,
                    album: 'TG Music Player',
                    artwork: [
                        { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' },
                    ]
                });
            } else if (currentRadio) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: currentRadio.name,
                    artist: currentRadio.genre,
                    album: 'Radio',
                    artwork: [
                        { src: currentRadio.image, sizes: '512x512', type: 'image/jpeg' },
                    ]
                });
            }

            navigator.mediaSession.setActionHandler('play', () => togglePlay());
            navigator.mediaSession.setActionHandler('pause', () => togglePlay());
            navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
            navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime !== undefined) {
                    seek(details.seekTime);
                }
            });
        }
    }, [currentTrack, currentRadio]);

    // Update playback state for Media Session
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [isPlaying]);

    const toggleRepeat = () => {
        setRepeatMode(prev => {
            if (prev === 'none') return 'all';
            if (prev === 'all') return 'one';
            return 'none';
        });
    };

    const toggleShuffle = () => setIsShuffle(!isShuffle);

    const downloadTrack = async (track: Track) => {
        if (downloadedTracks.has(track.id)) return;

        setIsDownloading(track.id);
        setDownloadProgress(prev => new Map(prev).set(track.id, 0));

        try {
            // Fetch audio
            const audioResponse = await fetch(track.url);
            const audioBlob = await audioResponse.blob();

            // Fetch cover
            let coverBlob: Blob | undefined;
            try {
                const coverResponse = await fetch(track.coverUrl);
                coverBlob = await coverResponse.blob();
            } catch (e) {
                console.warn("Failed to download cover:", e);
            }

            // Save to storage
            await storage.saveTrack(track, audioBlob, coverBlob);

            setDownloadedTracks(prev => new Set(prev).add(track.id));
            setDownloadProgress(prev => {
                const next = new Map(prev);
                next.delete(track.id);
                return next;
            });

            console.log("✅ Track downloaded:", track.title);
        } catch (error) {
            console.error("Download error:", error);
            setDownloadProgress(prev => {
                const next = new Map(prev);
                next.delete(track.id);
                return next;
            });
        } finally {
            setIsDownloading(null);
        }
    };

    const removeDownloadedTrack = async (trackId: string) => {
        try {
            await storage.deleteTrack(trackId);
            setDownloadedTracks(prev => {
                const next = new Set(prev);
                next.delete(trackId);
                return next;
            });
        } catch (error) {
            console.error("Error removing track:", error);
        }
    };

    const markTrackAsDownloaded = (trackId: string) => {
        setDownloadedTracks(prev => new Set(prev).add(trackId));
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            currentTime,
            duration,
            repeatMode,
            queue,
            downloadedTracks,
            downloadProgress,
            isDownloading,
            isShuffle,
            playTrack,
            playRadio,
            togglePlay,
            nextTrack,
            prevTrack,
            seek,
            toggleRepeat,
            toggleShuffle,
            downloadTrack,
            removeDownloadedTrack,
            searchState,
            setSearchState,
            resetSearch,
            user,
            refreshSubscriptionStatus,
            favorites,
            toggleFavorite,
            favoriteRadios,
            toggleFavoriteRadio,
            markTrackAsDownloaded
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
