import axios from 'axios';

// iTunes Search API (Free, No Key required)
const ITUNES_API_URL = 'https://itunes.apple.com/search';

// Songstats API (Requires Key)
const SONGSTATS_API_URL = 'https://songstats.p.rapidapi.com';
const RAPIDAPI_HOST = 'songstats.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY; // User needs to add this

export const musicApiService = {
    /**
     * Search for songs using iTunes API
     * @param {string} query - Search term (e.g., "Taylor Swift")
     * @returns {Promise<Array>} - List of formatted tracks
     */
    searchTracks: async (query) => {
        if (!query) return [];
        try {
            const response = await axios.get(ITUNES_API_URL, {
                params: {
                    term: query,
                    media: 'music',
                    entity: 'song',
                    limit: 20
                }
            });

            return response.data.results.map(item => ({
                id: item.trackId,
                title: item.trackName,
                artist: item.artistName,
                album: item.collectionName,
                cover: item.artworkUrl100?.replace('100x100', '600x600'), // Get higher res
                previewUrl: item.previewUrl,
                url: item.previewUrl, // Map for PlayerContext compatibility
                duration: formatDuration(item.trackTimeMillis),
                releaseDate: item.releaseDate,
                genre: item.primaryGenreName,
                trackViewUrl: item.trackViewUrl,
                source: 'itunes'
            }));
        } catch (error) {
            console.error("iTunes Search Error:", error);
            return [];
        }
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
     * Get detailed Track Stats from Songstats (Requires API Key)
     * This matches the user's provided snippet logic but uses Axios
     */
    getTrackDetails: async (trackId) => {
        if (!RAPIDAPI_KEY) {
            console.warn("Missing VITE_RAPIDAPI_KEY in .env");
            return null;
        }

        try {
            // Note: The user's snippet used specific Spotify/Apple IDs. 
            // Realistically, we need to map the iTunes ID to something Songstats understands 
            // or search Songstats by ISRC if available from iTunes.

            // iTunes often provides isrc? rarely in public search, but let's assume we might have it or pass a query.
            // For now, this implementation follows the user's snippet structure for a specific request.

            const options = {
                method: 'GET',
                url: `${SONGSTATS_API_URL}/tracks/info`,
                params: {
                    // In a real scenario, we'd need to pass the actual IDs here.
                    // For testing purposes as per user snippet:
                    spotify_track_id: '3VTPi12rK7mioSLL0mmu75'
                },
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                }
            };

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Songstats API Error:", error);
            return null;
        }
    }
};

// Helper to format milliseconds to MM:SS
const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
