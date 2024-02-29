const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const zlib = require('zlib');
const util = require('util');

const gzip = util.promisify(zlib.gzip);
const storage = new Storage();

const endpoint = 'https://www.wefly.tokyo/api/tracks';

async function saveTracks(tracks) {
    for (const track of tracks) {
        try {
            await axios.post(endpoint, track);
        } catch (error) {
            console.error(`Failed to post track ${track.getId()}: ${error.message}`);
        };
    }
}

module.exports = { saveTracks };
