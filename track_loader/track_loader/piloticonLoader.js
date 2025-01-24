const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const http = require('http');
const https = require('https');
const stream = require('stream');
const util = require('util');
const { LAKE_BUCKET_NAME } = require('../config');

const pipeline = util.promisify(stream.pipeline);

const folder = 'pilot_icons';

async function loadPilotIcons(track) {
    const storage = new Storage();
    const imageUrl = `https://www.livetrack24.com/files/users/${track.getTrackId()}/photo.thumb.jpg`;
    try {
        const response = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream',
            httpAgent: new http.Agent({ family: 4 }),
            httpsAgent: new https.Agent({ family: 4 }),
            timeout: 10000,
        });

        const gcsFileName = `${folder}/${track.pilotname}.jpg`;
        const file = storage.bucket(LAKE_BUCKET_NAME).file(gcsFileName);

        await pipeline(
            response.data,
            file.createWriteStream({
                metadata: {
                    contentType: 'image/jpeg',
                }
            })
        );

        console.log(`pilot icon uploaded to ${gcsFileName}`);
    } catch (error) {
        console.error('Error downloading or uploading image:', error);
    }
}
module.exports = { loadPilotIcons };