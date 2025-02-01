const axios = require('axios');
const { API_URL } = require('../config.js');

async function uploadTrack(track) {
    try {
        await axios.post(`${API_URL}/tracks`, track.serialize());
        console.log(`Uploaded track ${track.getId()}`);
    } catch (error) {
        console.error(`Failed to post track ${track.getId()}: ${error.message}`);
    };
}

module.exports = { uploadTrack };