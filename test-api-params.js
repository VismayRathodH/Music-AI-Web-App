import https from 'https';

const headers = {
    'x-rapidapi-key': '97ba09e1ecmsh28a28193137ba14p11448bjsnad3bf655b336',
    'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

function request(path) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'youtube-music-api-yt.p.rapidapi.com',
            path: path,
            headers: headers
        };

        const req = https.request(options, (res) => {
            let chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString()));
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    console.log("Searching...");
    const searchRes = await request('/search?q=NCS');
    console.log("Search Result:", searchRes.substring(0, 200) + "...");

    let videoId;
    try {
        const data = JSON.parse(searchRes);
        // Find first video
        const video = (Array.isArray(data) ? data : (data.content || [])).find(i => i.videoId);
        if (video) videoId = video.videoId;
    } catch (e) { console.error("Parse error", e); }

    if (!videoId) {
        console.error("No videoId found in search.");
        return;
    }

    console.log("Found ID:", videoId);

    const variations = [
        `/get-song?videoId=${videoId}`,
        `/get-song?id=${videoId}`,
        `/dl?id=${videoId}`,
        `/dl?videoId=${videoId}`,
        `/download?id=${videoId}`,
        `/stream?id=${videoId}`
    ];

    for (const path of variations) {
        console.log(`Testing ${path}...`);
        const res = await request(path);
        if (res.includes("error") || res.length < 50) {
            console.log(`Failed: ${res}`);
        } else {
            console.log(`SUCCESS! Result for ${path}:`, res.substring(0, 100));
        }
    }
}

run();
