import axios from 'axios';

const RAPIDAPI_KEY = 'a8f35fd96dmsh7e79d7e5b5c94a7p1d95cajsnd9fc5842ec2b';

async function testSearch(host, endpoint, params) {
    try {
        const response = await axios.get(`https://${host}${endpoint}`, {
            params: params,
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': host
            }
        });
        console.log(`\n✓ ${host}${endpoint}`);
        console.log(`  Results:`, response.data?.items?.length || response.data?.contents?.length || 'data received');
        if (response.data?.items?.[0]) {
            console.log(`  First result:`, response.data.items[0].id?.videoId || response.data.items[0].videoId);
        } else if (response.data?.contents?.[0]) {
            console.log(`  First result sample:`, JSON.stringify(response.data.contents[0]).substring(0, 100));
        }
    } catch (error) {
        console.log(`✗ ${host}${endpoint}: ${error.response?.status || error.message}`);
    }
}

async function run() {
    console.log('Testing YouTube Search APIs...\n');

    await testSearch('youtube-v31.p.rapidapi.com', '/search', { q: 'Billionaire', part: 'snippet' });
    await testSearch('youtube138.p.rapidapi.com', '/search/', { q: 'Billionaire' });
    await testSearch('yt-api.p.rapidapi.com', '/search', { query: 'Billionaire' });
    await testSearch('simple-youtube-search.p.rapidapi.com', '/search', { query: 'Billionaire' });
}

run();
