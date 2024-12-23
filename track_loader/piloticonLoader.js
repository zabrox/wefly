const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const http = require('http');
const https = require('https');
const stream = require('stream');
const util = require('util');

const pipeline = util.promisify(stream.pipeline);

const bucketName = 'wefly-lake';
const folder = 'pilot_icons';

async function loadPilotIcons(tracks) {
    const storage = new Storage();
    tracks.forEach(async (track) => {
        const imageUrl = `https://www.livetrack24.com/files/users/${track.metadata.liveTrackUserId}/photo.thumb.jpg`;
        try {
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream',
                httpAgent: new http.Agent({ family: 4 }),
                httpsAgent: new https.Agent({ family: 4 }),
                timeout: 10000,
            });

            const gcsFileName = `${folder}/${track.metadata.pilotname}.jpg`;
            const file = storage.bucket(bucketName).file(gcsFileName);

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
    });
}
module.exports = { loadPilotIcons };