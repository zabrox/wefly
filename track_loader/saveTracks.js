const axios = require('axios');

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
