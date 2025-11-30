import { Track } from '../types';

/**
 * Remove duplicate tracks based on artist and title
 * Keeps only the first occurrence of each unique track
 */
export const deduplicateTracks = (tracks: Track[]): Track[] => {
    const seen = new Set<string>();
    const result: Track[] = [];

    for (const track of tracks) {
        // Create a unique key from artist and title (normalized)
        const key = `${track.artist.toLowerCase().trim()}|||${track.title.toLowerCase().trim()}`;

        if (!seen.has(key)) {
            seen.add(key);
            result.push(track);
        }
    }

    return result;
};
