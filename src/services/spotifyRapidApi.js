import axios from 'axios';

const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const rapidApiHost = import.meta.env.VITE_RAPIDAPI_HOST;

const apiClient = axios.create({
    baseURL: `https://${rapidApiHost}`,
    headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
    },
});

export const searchArtists = async (query) => {
    try {
        const response = await apiClient.get('/search/', {
            params: {
                q: query,
                type: 'artist', // Changed from 'artists' to 'artist'
                limit: 10
            },
        });
        console.log("Search response:", response.data);
        return response.data?.artists?.items || [];
    } catch (error) {
        console.error("Error searching artists:", error);
        return [];
    }
};

export const getArtistOverview = async (artistId) => {
    try {
        const response = await apiClient.get('/artist_overview/', {
            params: {
                id: artistId,
            },
        });
        return response.data?.data?.artist || null;
    } catch (error) {
        console.error("Error getting artist overview:", error);
        return null;
    }
};
