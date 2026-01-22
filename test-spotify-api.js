import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const RAPIDAPI_KEY = process.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.VITE_RAPIDAPI_HOST;
const BASE_URL = `https://${RAPIDAPI_HOST}`;

async function testSpotifyAPI() {
    console.log("Config:", { RAPIDAPI_HOST, RAPIDAPI_KEY: RAPIDAPI_KEY ? "EXISTS" : "MISSING" });

    try {
        console.log("\n--- Testing Search ---");
        const searchRes = await axios.get(`${BASE_URL}/search`, {
            params: { q: 'NCS', type: 'tracks' },
            headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': RAPIDAPI_HOST }
        });
        const items = searchRes.data.tracks?.items || [];
        console.log(`Found ${items.length} items.`);
        if (items.length > 0) {
            const first = items[0].data || items[0];
            const id = first.id || first.uri?.split(':').pop();
            console.log("First track:", { id, name: first.name });

            if (id) {
                console.log("\n--- Testing Lyrics ---");
                const lyricsRes = await axios.get(`${BASE_URL}/track_lyrics`, {
                    params: { id },
                    headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': RAPIDAPI_HOST }
                });
                console.log("Lyrics data:", JSON.stringify(lyricsRes.data).substring(0, 100) + "...");

                console.log("\n--- Testing Download ---");
                const dlRes = await axios.get(`${BASE_URL}/download_track`, {
                    params: { id },
                    headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': RAPIDAPI_HOST }
                });
                console.log("Download link:", dlRes.data.link || dlRes.data.url || "NOT FOUND");
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.error("Data:", e.response.data);
    }
}

testSpotifyAPI();
