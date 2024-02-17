const axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const cheerio = require('cheerio');

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

const bucketName = 'wefly-lake';
const baseUrl = 'https://www.livetrack24.com';

function localFilePath(page, date) {
    return `./${date}/livetrack24/TrackListPage-${page}.html`;
}

async function uploadToGCS(page, date) {
    const storage = new Storage();
    try {
        const destination = `${date}/livetrack24/TrackListPage-${page}.html`;
        const bucket = storage.bucket(bucketName);
        const options = {
            destination: destination,
        }
        bucket.upload(localFilePath(page, date), options);
    } catch (error) {
        console.error(`Failed to upload file: ${error.message}`);
        throw error;
    }
}

async function saveToLocal(html, page, date) {
    // create directory if not exists
    const filePath = localFilePath(page, date);
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    const options = {
        encoding: 'utf8',
        flag: 'w'
    }
    fs.writeFileSync(filePath, html, options);
}

async function downloadTrackListPage(page, date) {
    // const url = `${baseUrl}/tracks/country/jp/from/${date}/to/${date}/page_num/${page}/`;
    const url = `${baseUrl}/tracks/from/${date}/to/${date}/page_num/${page}/`;
    console.log(`Downloading ${url}`)
    const response = await axios.get(url, {
        httpAgent,
        httpsAgent,
        timeout: 10000
    });
    if (response.status !== 200) {
        throw new Error('Failed to download page');
    }

    const $ = cheerio.load(response.data);
    const trackRows = $('[id^="trackRow_"]');

    await saveToLocal(response.data, page, date);

    if (trackRows.length >= 10) {
        await uploadToGCS(page, date);
        return downloadTrackListPage(page + 1, date);
    } else if (trackRows.length > 0) {
        await uploadToGCS(page, date);
    }
}

async function loadTrackListPages(date) {
    try {
        await downloadTrackListPage(1, date);
        console.log('All pages have been downloaded and uploaded to GCS.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

module.exports = {loadTrackListPages};