export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // Seconds
  coverUrl: string; // Mapped from 'image'
  url: string;
  genre?: string;
  isLocal?: boolean;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  url: string;
  image: string;
}

export type RepeatMode = 'none' | 'all' | 'one';
export type SearchMode = 'all' | 'artist' | 'track';

export interface Playlist {
  id: string;
  title: string;
  name?: string; // Alias for title to support oldfront logic if needed
  coverUrl: string;
  trackIds: string[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrackId: string | null;
  progress: number;
  volume: number;
}

export interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_admin: boolean;
  is_premium: boolean;
  is_premium_pro?: boolean;
  subscription_status?: any;
}

export interface UserStats {
  total_users: number;
  premium_users: number;
  admin_users: number;
  new_users_today: number;
  total_revenue_ton: number;
  total_revenue_stars: number;
  total_revenue_rub: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  currency: string;
  plan: string;
  status: string;
  created_at: string;
}
