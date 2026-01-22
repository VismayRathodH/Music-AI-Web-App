import axios from 'axios';

const RAPIDAPI_KEY = '97ba09e1ecmsh28a28193137ba14p11448bjsnad3bf655b336';
const RAPIDAPI_HOST = 'youtube-music-api-yt.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

async function searchTracks(query) {
    if (!query) return [];
    try {
        const searchQuery = `${query} music`;
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { query: searchQuery },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            }
        });

        console.log("YT-API Search Response keys:", Object.keys(response.data));
        const results = response.data.data || response.data || [];
        console.log("Results length:", Array.isArray(results) ? results.length : "Not an array");

        if (Array.isArray(results) && results.length > 0) {
            console.log("First result sample:", JSON.stringify(results[0], null, 2));
        }

    } catch (error) {
        console.error("YT-API Search Error:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

searchTracks('NCS');
