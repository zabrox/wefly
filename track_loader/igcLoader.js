const axios = require('axios');
const http = require('http');
const https = require('https');
const { Storage } = require('@google-cloud/storage');

const bucketName = 'wefly-lake';

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function loadIgc(date, track, opts) {
    const igcFileName = `${date}/igcs/${track.getId()}.igc`;
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(igcFileName);

    try {
        const [exists] = await file.exists();
        if (!opts.force && exists) {
            console.log(`IGC file already exists: ${igcFileName}`);
            return;
        }

        const igcUrl = `https://www.livetrack24.com/leo_live.php?op=igc&trackID=${track.metadata.liveTrackId}`;
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
        // Save to GCS if igcData is not empty
        if (igcData.length === 0) {
            console.error(`Empty IGC data for trackID ${track.getId()}`);
            return;
        }
        await file.save(igcData);
        console.log(`Saved IGC file to ${igcFileName}`);
    } catch (error) {
        console.error(`Error downloading or saving IGC for trackID ${track.getId()}: ${error}`);
    }
}

async function loadIgcs(date, tracks, opts) {
    for (const track of tracks) {
        try {
            await loadIgc(date, track, opts);
        } catch (error) {
            console.error(`Error downloading or saving IGC for trackID ${track.getId()}: ${error}`);
        }
    };
}

module.exports = { loadIgcs };