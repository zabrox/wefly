const axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

const bucketName = 'wefly-lake';
const baseUrl = 'https://www.livetrack24.com';

function localFilePath(track, date) {
    return `./${date}/livetrack24/TrackPage-${track.getId()}.html`;
}

function gcsFilePath(track, date) {
    return `${date}/livetrack24/TrackPage-${track.getId()}.html`;
}

async function uploadToGCS(track, date) {
    const storage = new Storage();
    try {
        const destination = gcsFilePath(track, date);
        const bucket = storage.bucket(bucketName);
        const options = {
            destination: destination,
        }
        bucket.upload(localFilePath(track, date), options);
    } catch (error) {
        console.error(`Failed to upload file: ${error.message}`);
        throw error;
    }
}

async function saveToLocal(html, track, date) {
    const options = {
        encoding: 'utf8',
        flag: 'w'
    }
    fs.writeFileSync(localFilePath(track, date), html, options);
}

async function checkExists(track, date) {
    const fileName = gcsFilePath(track, date);
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    return exists;
}

async function downloadTrackPage(track, date, opts) {
    const exists = await checkExists(track, date);
    if (!opts.force && exists) {
        console.log(`Track file already exists: ${track.getId()}`);
        return;
    }
    const url = `${baseUrl}/track/${track.livetrackId}`;
    console.log(`Downloading ${url}`)
    const response = await axios.get(url, {
        httpAgent,
        httpsAgent,
        timeout: 10000
    });
    if (response.status !== 200) {
        throw new Error(`Failed to download track page for ${track.getId()}`);
    }

    await saveToLocal(response.data, track, date);
    await uploadToGCS(track, date);
}

async function loadTrackPages(date, tracks, opts) {
    for (const track of tracks) {
        try {
            await downloadTrackPage(track, date, opts);

        } catch (error) {
            console.error(`Error downloading or saving track page for ${track.getId()}: ${error}`);
        }
    }
}

module.exports = { loadTrackPages };