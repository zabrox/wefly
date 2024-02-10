const axios = require('axios');
const http = require('http');
const https = require('https');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'wefly-lake';

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function loadIgc(date, track) {
    const igcFileName = `${date}/igcs/${track.pilotname}-${track.lastTime.format('YYYYMMDDHHmmss')}.igc`;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(igcFileName);

    try {
        const [exists] = await file.exists();
        if (exists) {
            console.log(`IGC file already exists: ${igcFileName}`);
            return;
        }

        const igcUrl = `https://www.livetrack24.com/leo_live.php?op=igc&trackID=${track.id}`;
        const response = await axios.get(igcUrl, {
            responseType: 'arraybuffer',
            httpAgent,
            httpsAgent,
            timeout: 10000,
        });
        if (response.status !== 200) {
            console.error(`Failed to download igc ${track.pilotname}`);
            return;
        }
        const igcData = response.data;
        await file.save(igcData);
        console.log(`Saved IGC file to ${igcFileName}`);
    } catch (error) {
        console.error(`Error downloading or saving IGC for trackID ${track.trackid}: ${error}`);
    }
}

async function loadIgcs(date, tracks) {
    tracks.forEach(async track => {
        try {
            await loadIgc(date, track);
        } catch (error) {
            console.error(`Error downloading or saving IGC for trackID ${track.pilotname}: ${error}`);
        }
    });
}

module.exports = { loadIgcs };