import { Track, User, UserStats, Transaction } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SearchResponse {
    results: any[];
    count: number;
}

interface RadioResponse {
    results: any[];
    count: number;
}

export const api = {
    async searchTracks(query: string, page: number = 1, limit: number = 20): Promise<Track[]> {
        const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Search failed');
        const data: SearchResponse = await response.json();
        return data.results.map(mapBackendTrack);
    },

    async getRadioStations(): Promise<Track[]> {
        const response = await fetch(`${API_URL}/api/radio`);
        if (!response.ok) throw new Error('Failed to fetch radio');
        const data: RadioResponse = await response.json();
        // Map radio stations to Track format for compatibility
        return data.results.map((station: any) => ({
            id: station.id,
            title: station.name,
            artist: station.genre || 'Radio',
            duration: 0,
            coverUrl: station.image,
            url: station.url,
            genre: station.genre
        }));
    },

    async authUser(user: any): Promise<{ user: User, is_new_user: boolean }> {
        const response = await fetch(`${API_URL}/api/user/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Auth failed');
        return await response.json();
    },

    async downloadToChat(userId: number, track: Track): Promise<any> {
        const response = await fetch(`${API_URL}/api/download/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                track: {
                    ...track,
                    image: track.coverUrl // Map back to backend format
                }
            })
        });
        if (!response.ok) throw new Error('Download to chat failed');
        return await response.json();
    },

    async getAdminStats(userId: number): Promise<UserStats> {
        const response = await fetch(`${API_URL}/api/admin/stats?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    },

    async getAdminUsers(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/users?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },

    async getLyrics(trackId: string, title: string, artist: string): Promise<string> {
        const response = await fetch(`${API_URL}/api/lyrics/${trackId}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
        if (!response.ok) return 'Текст не найден';
        const data = await response.json();
        return data.lyrics_text;
    }
};

function mapBackendTrack(backendTrack: any): Track {
    return {
        id: backendTrack.id,
        title: backendTrack.title,
        artist: backendTrack.artist,
        duration: backendTrack.duration,
        coverUrl: backendTrack.image,
        url: backendTrack.url,
        genre: 'Music' // Backend doesn't always return genre for tracks
    };
}
