import axios from 'axios';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const BASE_URL = `https://${RAPIDAPI_HOST}`;
import defaultCover from '../assets/default_cover.png';

export const musicApiService = {
    /**
     * Search for songs using YouTube Data API v3
     * @param {string} query - Search term
     * @returns {Promise<Array>} - List of formatted tracks
     */
    searchTracks: async (query) => {
        if (!query) return [];
        try {
            const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

            if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
                console.error('YouTube API key not configured. Please add VITE_YOUTUBE_API_KEY to your .env file.');
                console.log('Get your free API key from: https://console.cloud.google.com/apis/credentials');
                return [];
            }

            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query + ' music',
                    type: 'video',
                    videoCategoryId: '10', // Music category
                    maxResults: 20,
                    key: YOUTUBE_API_KEY
                }
            });

            console.log("YouTube Search Response:", response.data);

            const results = response.data.items || [];

            return results.map(item => {
                const snippet = item.snippet;
                return {
                    id: item.id.videoId,
                    title: snippet.title,
                    artist: snippet.channelTitle || "Unknown Artist",
                    album: "YouTube",
                    cover: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || defaultCover,
                    duration: "0:00", // Duration requires additional API call
                    type: 'track',
                    source: 'youtube'
                };
            }).filter(item => item.id);
        } catch (error) {
            console.error("YouTube Search Error:", error);
            if (error.response?.status === 403) {
                console.error('API Key error. Please check your YouTube API key and quota.');
            }
            return [];
        }
    },

    /**
     * Format milliseconds to "m:ss"
     */
    formatDuration: (ms) => {
        if (!ms) return "0:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    /**
     * Helper to find the best match for a specific song
     */
    searchBestMatch: async (title, artist) => {
        try {
            const query = `${title} ${artist}`;
            const results = await musicApiService.searchTracks(query);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            return null;
        }
    },

    /**
     * Get playable stream URL
     * For YouTube videos, return null as YouTube IFrame Player handles playback
     * @param {string} trackId 
     * @returns {Promise<string|null>}
     */
    getStreamUrl: async (trackId) => {
        // YouTube IFrame Player API handles playback directly
        // No need to fetch stream URLs
        return null;
    },

    /**
     * Get lyrics for a track (Not supported by this specific YT-Music API yet)
     * @param {string} trackId 
     * @returns {Promise<Object|null>}
     */
    getLyrics: async (trackId) => {
        return null;
    }
};
