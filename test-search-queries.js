import axios from 'axios';

const RAPIDAPI_KEY = 'a8f35fd96dmsh7e79d7e5b5c94a7p1d95cajsnd9fc5842ec2b';

async function testDifferentQueries() {
    const queries = ['Ed Sheeran', 'Linkin Park', 'Coldplay', 'Taylor Swift'];

    for (const query of queries) {
        try {
            const response = await axios.get('https://youtube-music-api-yt.p.rapidapi.com/search', {
                params: { query: query },
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com'
                }
            });

            const items = response.data.data || response.data || [];
            console.log(`\n"${query}" - Total: ${items.length}`);
            items.slice(0, 2).forEach((item, i) => {
                console.log(`  ${i + 1}. ${item.name} - ${item.artist?.name || 'Unknown'} (ID: ${item.videoId})`);
            });
        } catch (error) {
            console.error(`Error for "${query}":`, error.message);
        }
    }
}

testDifferentQueries();
