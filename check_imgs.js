const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('search.html', 'utf8');
const imgRegex = /<img[^>]+src="([^">]+)"/g;
let match;
const urls = new Set();

while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
        urls.add(match[1]);
    }
}

urls.forEach(url => {
    https.get(url, (res) => {
        if (res.statusCode >= 400) {
            console.log("Failed " + res.statusCode + ": " + url);
        }
    }).on('error', (e) => {
        console.error("Error fetching: " + url + " - " + e.message);
    });
});
