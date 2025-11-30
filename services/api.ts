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
    // --- Music & Search ---
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

    async getGenreTracks(genreId: number, limit: number = 20, page: number = 1): Promise<Track[]> {
        const response = await fetch(`${API_URL}/api/genre/${genreId}?limit=${limit}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch genre tracks');
        const data: SearchResponse = await response.json();
        return data.results.map(mapBackendTrack);
    },

    async getTrack(trackId: string): Promise<Track> {
        const response = await fetch(`${API_URL}/api/track/${trackId}`);
        if (!response.ok) throw new Error('Failed to fetch track');
        const data = await response.json();
        return mapBackendTrack(data);
    },

    async getLyrics(trackId: string, title: string, artist: string): Promise<string> {
        const response = await fetch(`${API_URL}/api/lyrics/${trackId}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
        if (!response.ok) return 'Текст не найден';
        const data = await response.json();
        return data.lyrics_text;
    },

    // --- User & Auth ---
    async authUser(user: any): Promise<{ user: User, is_new_user: boolean }> {
        const response = await fetch(`${API_URL}/api/user/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Auth failed');
        return await response.json();
    },

    async getSubscriptionStatus(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/user/subscription-status?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch subscription status');
        return await response.json();
    },

    // --- Downloads ---
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

    // --- Admin Panel ---
    async getAdminStats(userId: number): Promise<UserStats> {
        const response = await fetch(`${API_URL}/api/admin/stats?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    },

    async getAdminUsers(userId: number, filterType: string = 'all'): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/users?user_id=${userId}&filter_type=${filterType}`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },

    async getAdminTransactions(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/transactions?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return await response.json();
    },

    async getAdminPromocodes(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/promocodes?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch promocodes');
        return await response.json();
    },

    async createPromocode(userId: number, data: any): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/promocodes?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create promocode');
        return await response.json();
    },

    async deletePromocode(userId: number, promoId: number): Promise<void> {
        const response = await fetch(`${API_URL}/api/admin/promocodes/${promoId}?user_id=${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete promocode');
    },

    async getTopUsers(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/top-users?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch top users');
        return await response.json();
    },

    async getActivityStats(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/activity-stats?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch activity stats');
        return await response.json();
    },

    async broadcastMessage(userId: number, message: string): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/broadcast?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        if (!response.ok) throw new Error('Failed to broadcast');
        return await response.json();
    },

    async grantRights(adminId: number, data: any): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/grant?admin_id=${adminId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to grant rights');
        return await response.json();
    },

    async getCacheStats(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/cache/stats?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch cache stats');
        return await response.json();
    },

    async resetCache(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/admin/cache/reset?admin_id=${userId}`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to reset cache');
        return await response.json();
    },

    // --- Referrals ---
    async registerReferral(userId: number, referralCode: string): Promise<void> {
        const response = await fetch(
            `${API_URL}/api/referral/register?user_id=${userId}&referral_code=${referralCode}`,
            { method: 'POST' }
        );
        if (!response.ok) throw new Error('Failed to register referral');
    },

    async getReferralStats(userId: number): Promise<any> {
        const response = await fetch(`${API_URL}/api/referral/stats?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch referral stats');
        return await response.json();
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
