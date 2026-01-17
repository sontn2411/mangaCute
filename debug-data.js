const https = require('https');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function debug() {
    try {
        console.log('Fetching home...');
        const home = await fetch('https://otruyenapi.com/v1/api/home');
        const firstManga = home.data.items[0];
        console.log('First manga slug:', firstManga.slug);

        console.log('Fetching details...');
        const detail = await fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${firstManga.slug}`);
        const chapters = detail.data.item.chapters[0].server_data;

        console.log('Number of chapters:', chapters.length);
        console.log('Sample chapter (first):', chapters[0]);
        console.log('Sample chapter (last):', chapters[chapters.length - 1]);
    } catch (e) {
        console.error(e);
    }
}

debug();
